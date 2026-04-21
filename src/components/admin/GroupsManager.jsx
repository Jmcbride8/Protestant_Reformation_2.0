import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  name: '', tag: '', description: '', meeting_time: '',
  leader_name: '', leader_title: '', leader_bio: '', leader_photo_url: '',
  sort_order: 0, is_active: true,
};

export default function GroupsManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: groups = [] } = useQuery({
    queryKey: ['adminGroups'],
    queryFn: () => base44.entities.CommunityGroup.list('sort_order', 50),
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, leader_photo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await base44.entities.CommunityGroup.update(editingId, form);
      toast.success('Group updated');
    } else {
      await base44.entities.CommunityGroup.create(form);
      toast.success('Group created');
    }
    queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    queryClient.invalidateQueries({ queryKey: ['communityGroups'] });
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (group) => {
    setForm({
      name: group.name || '', tag: group.tag || '', description: group.description || '',
      meeting_time: group.meeting_time || '', leader_name: group.leader_name || '',
      leader_title: group.leader_title || '', leader_bio: group.leader_bio || '',
      leader_photo_url: group.leader_photo_url || '',
      sort_order: group.sort_order || 0, is_active: group.is_active !== false,
    });
    setEditingId(group.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await base44.entities.CommunityGroup.delete(id);
    queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    queryClient.invalidateQueries({ queryKey: ['communityGroups'] });
    toast.success('Group deleted');
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-primary">Community Groups</h3>
        {!showForm && (
          <Button size="sm" className="font-body text-xs gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Add Group
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-card border border-border/50 rounded-xl space-y-4">
          <h4 className="font-heading text-lg text-primary">{editingId ? 'Edit Group' : 'New Group'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-body text-xs">Group Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label className="font-body text-xs">Tag (e.g. Young Adults)</Label>
              <Input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="font-body text-xs">Description *</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} required />
            </div>
            <div className="space-y-1">
              <Label className="font-body text-xs">Meeting Time</Label>
              <Input placeholder="e.g. Fridays at 7pm" value={form.meeting_time} onChange={e => setForm(f => ({ ...f, meeting_time: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="font-body text-xs">Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label className="font-body text-xs">Leader Name *</Label>
              <Input value={form.leader_name} onChange={e => setForm(f => ({ ...f, leader_name: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label className="font-body text-xs">Leader Title</Label>
              <Input placeholder="e.g. Group Pastor" value={form.leader_title} onChange={e => setForm(f => ({ ...f, leader_title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="font-body text-xs">Leader Bio</Label>
              <Textarea value={form.leader_bio} onChange={e => setForm(f => ({ ...f, leader_bio: e.target.value }))} rows={2} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="font-body text-xs">Leader Photo</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
              {uploading && <p className="font-body text-xs text-muted-foreground">Uploading...</p>}
              {form.leader_photo_url && (
                <img src={form.leader_photo_url} alt="preview" className="h-20 w-20 object-cover rounded-lg mt-1" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label className="font-body text-xs">Active (visible on site)</Label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm" className="font-body text-xs gap-2">
              <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Group'}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="font-body text-xs gap-2" onClick={handleCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
            <div className="flex items-center gap-4">
              {group.leader_photo_url ? (
                <img src={group.leader_photo_url} alt={group.leader_name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-heading text-primary text-lg">{group.leader_name?.[0]}</span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-base text-primary">{group.name}</h4>
                  {!group.is_active && <span className="font-body text-xs text-muted-foreground">(inactive)</span>}
                  {group.tag && <span className="font-body text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{group.tag}</span>}
                </div>
                <p className="font-body text-xs text-muted-foreground">Led by {group.leader_name}{group.leader_title ? ` · ${group.leader_title}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(group.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="font-body text-muted-foreground text-center py-8">No groups yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}