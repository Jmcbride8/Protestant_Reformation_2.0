import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Users, Pencil, Camera } from 'lucide-react';
import MemberProfileModal from './MemberProfileModal';
import { toast } from 'sonner';

const roleColors = {
  Member: 'bg-secondary text-secondary-foreground',
  Guest: 'bg-muted text-muted-foreground',
  Staff: 'bg-blue-100 text-blue-700',
  Admin: 'bg-purple-100 text-purple-700',
  Pastor: 'bg-accent/20 text-accent-foreground',
};

export default function MemberDirectory() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [editingMember, setEditingMember] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [uploadingPhotoId, setUploadingPhotoId] = useState(null);
  const photoInputRef = useRef(null);
  const uploadTargetRef = useRef(null);

  const handlePhotoClick = (member) => {
    uploadTargetRef.current = member;
    photoInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    const member = uploadTargetRef.current;
    if (!file || !member) return;
    setUploadingPhotoId(member.id);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.MemberProfile.update(member.id, { photo_url: file_url });
    queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
    queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    toast.success('Photo updated');
    setUploadingPhotoId(null);
    e.target.value = '';
  };

  const { data: members = [] } = useQuery({
    queryKey: ['memberProfiles'],
    queryFn: () => base44.entities.MemberProfile.list('-created_date', 200),
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['communityGroups'],
    queryFn: () => base44.entities.CommunityGroup.list('sort_order', 50),
  });

  const filtered = members.filter(m => {
    const matchSearch = !search ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.family_members?.some(f => f.toLowerCase().includes(search.toLowerCase()));
    const matchGroup = filterGroup === 'all' || m.small_group_id === filterGroup || (!m.small_group_id && filterGroup === 'none');
    const matchRole = filterRole === 'all' || m.role === filterRole;
    return matchSearch && matchGroup && matchRole;
  });

  // Group members by family_unit_id for display
  const familyGroups = {};
  filtered.forEach(m => {
    if (m.family_unit_id) {
      if (!familyGroups[m.family_unit_id]) familyGroups[m.family_unit_id] = [];
      familyGroups[m.family_unit_id].push(m.id);
    }
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
    setEditingMember(null);
    setCreatingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-heading text-xl text-primary">{members.length} Members</span>
        </div>
        <Button onClick={() => setCreatingNew(true)} className="font-body gap-2 bg-primary">
          <UserPlus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or family member…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 font-body"
          />
        </div>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-48 font-body text-sm">
            <SelectValue placeholder="Small Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="none">No Group</SelectItem>
            {groups.map(g => (
              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-36 font-body text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {['Member', 'Guest', 'Staff', 'Admin', 'Pastor'].map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(member => {
          const group = groups.find(g => g.id === member.small_group_id);
          const isInFamily = member.family_unit_id && familyGroups[member.family_unit_id]?.length > 1;
          return (
            <div
              key={member.id}
              className="p-4 bg-card rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Avatar with photo upload */}
                <div
                  className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-secondary flex items-center justify-center cursor-pointer group"
                  onClick={() => handlePhotoClick(member)}
                  title="Click to update photo"
                >
                  {member.photo_url
                    ? <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                    : <span className="font-heading text-lg text-primary">{member.full_name?.[0]}</span>
                  }
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    {uploadingPhotoId === member.id
                      ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Camera className="w-4 h-4 text-white" />
                    }
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-heading text-base text-primary truncate">{member.full_name}</h4>
                    {isInFamily && <span title="Part of a family unit">👨‍👩‍👧</span>}
                  </div>
                  <p className="font-body text-xs text-muted-foreground truncate">{member.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className={`font-body text-xs ${roleColors[member.role] || roleColors.Member}`}>
                      {member.role || 'Member'}
                    </Badge>
                    {group && (
                      <Badge variant="outline" className="font-body text-xs">{group.name}</Badge>
                    )}
                    {member.baptized && (
                      <Badge className="font-body text-xs bg-purple-100 text-purple-700">Baptized</Badge>
                    )}
                  </div>

                  {/* Family members */}
                  {member.family_members?.length > 0 && (
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Family: {member.family_members.join(', ')}
                    </p>
                  )}


                </div>

                <Button variant="ghost" size="icon" onClick={() => setEditingMember(member)}>
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground font-body">
          No members found.
        </div>
      )}

      {/* Hidden file input for photo uploads */}
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

      {(editingMember || creatingNew) && (
        <MemberProfileModal
          member={editingMember}
          groups={groups}
          onClose={() => { setEditingMember(null); setCreatingNew(false); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}