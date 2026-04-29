import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function GroupSettingsForm({ group }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    tag: '',
    description: '',
    meeting_time: '',
    leader_name: '',
    leader_title: '',
    leader_bio: '',
  });

  // Fetch group members (MemberProfile records with matching small_group_id)
  const { data: members = [] } = useQuery({
    queryKey: ['groupMembers', group?.id],
    queryFn: () => group?.id ? base44.entities.MemberProfile.filter({ small_group_id: group.id }, '-full_name', 100) : [],
    enabled: !!group?.id,
  });

  useEffect(() => {
    if (group) {
      setForm({
        name: group.name || '',
        tag: group.tag || '',
        description: group.description || '',
        meeting_time: group.meeting_time || '',
        leader_name: group.leader_name || '',
        leader_title: group.leader_title || '',
        leader_bio: group.leader_bio || '',
      });
    }
  }, [group]);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.CommunityGroup.update(group.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOwnedGroups'] });
      toast.success('Group settings saved!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl p-8 space-y-6 max-w-2xl">
      <h3 className="font-heading text-xl text-primary">Group Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body text-sm">Group Name</Label>
          <Input className="font-body" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Tag / Label</Label>
          <Input className="font-body" placeholder="e.g. Young Adults" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm">Description</Label>
        <Textarea className="font-body" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm">Meeting Time</Label>
        <Input className="font-body" placeholder="e.g. Fridays at 7pm" value={form.meeting_time} onChange={e => setForm(f => ({ ...f, meeting_time: e.target.value }))} />
      </div>

      <div className="border-t border-border/40 pt-4">
        <h4 className="font-heading text-base text-primary mb-4">Leader Info</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Leader Name</Label>
            {members.length > 0 ? (
              <Select value={form.leader_name} onValueChange={value => setForm(f => ({ ...f, leader_name: value }))}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.full_name}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input className="font-body" value={form.leader_name} onChange={e => setForm(f => ({ ...f, leader_name: e.target.value }))} placeholder="No members in group" />
            )}
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Leader Title</Label>
            <Input className="font-body" placeholder="e.g. Group Pastor" value={form.leader_title} onChange={e => setForm(f => ({ ...f, leader_title: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label className="font-body text-sm">Leader Bio</Label>
          <Textarea className="font-body" rows={2} value={form.leader_bio} onChange={e => setForm(f => ({ ...f, leader_bio: e.target.value }))} />
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="font-body gap-2">
        <Save className="w-4 h-4" />
        {mutation.isPending ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
}