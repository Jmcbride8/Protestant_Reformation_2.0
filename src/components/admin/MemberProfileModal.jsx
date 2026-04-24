import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

function TagInput({ label, values = [], onChange, suggestions = [] }) {
  const [input, setInput] = useState('');

  const add = (val) => {
    const trimmed = val.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput('');
  };

  const remove = (val) => onChange(values.filter(v => v !== val));

  return (
    <div>
      <label className="font-body text-sm text-muted-foreground block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground font-body text-xs px-2 py-0.5 rounded-full">
            {v}
            <button type="button" onClick={() => remove(v)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
          placeholder="Type and press Enter…"
          className="font-body text-sm flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => add(input)}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {suggestions.filter(s => !values.includes(s)).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="font-body text-xs text-accent border border-accent/30 rounded-full px-2 py-0.5 hover:bg-accent/10 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MemberProfileModal({ member, groups = [], onClose, onSaved }) {
  const isNew = !member;
  const photoRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: member?.full_name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    photo_url: member?.photo_url || '',
    role: member?.role || 'Member',
    small_group_id: member?.small_group_id || '',
    family_members: member?.family_members || [],
    family_unit_id: member?.family_unit_id || '',
    baptized: member?.baptized || false,
    notes: member?.notes || '',
    is_directory_visible: member?.is_directory_visible !== false,
    joined_date: member?.joined_date || '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('photo_url', file_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      small_group_name: groups.find(g => g.id === form.small_group_id)?.name || '',
    };
    if (isNew) {
      await base44.entities.MemberProfile.create(payload);
      toast.success('Member added to directory');
    } else {
      await base44.entities.MemberProfile.update(member.id, payload);
      toast.success('Member profile updated');
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary">
            {isNew ? 'Add Member to Directory' : `Edit — ${member.full_name}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
              {form.photo_url
                ? <img src={form.photo_url} alt="Profile" className="w-full h-full object-cover" />
                : <span className="font-heading text-2xl text-primary">{form.full_name?.[0] || '?'}</span>
              }
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" className="font-body gap-2" onClick={() => photoRef.current?.click()}>
                <Upload className="w-3 h-3" />
                {uploading ? 'Uploading…' : 'Upload Photo'}
              </Button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Full Name *</label>
              <Input value={form.full_name} onChange={e => set('full_name', e.target.value)} required className="font-body" />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Email *</label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="font-body" />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Phone</label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)} className="font-body" />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Joined Date</label>
              <Input type="date" value={form.joined_date} onChange={e => set('joined_date', e.target.value)} className="font-body" />
            </div>
          </div>

          {/* Role & Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Role</label>
              <Select value={form.role} onValueChange={v => set('role', v)}>
                <SelectTrigger className="font-body text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Member', 'Guest', 'Staff', 'Admin', 'Pastor'].map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Small Group</label>
              <Select value={form.small_group_id || 'none'} onValueChange={v => set('small_group_id', v === 'none' ? '' : v)}>
                <SelectTrigger className="font-body text-sm">
                  <SelectValue placeholder="No group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Group</SelectItem>
                  {groups.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Family */}
          <div className="space-y-3">
            <TagInput
              label="Family Members (other attendees in this household)"
              values={form.family_members}
              onChange={v => set('family_members', v)}
            />
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Family Unit ID (shared across household members)</label>
              <Input
                value={form.family_unit_id}
                onChange={e => set('family_unit_id', e.target.value)}
                placeholder="e.g. rivera-family (same across all family members)"
                className="font-body text-sm"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-body text-sm">
              <input type="checkbox" checked={form.baptized} onChange={e => set('baptized', e.target.checked)} className="w-4 h-4" />
              Baptized
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-body text-sm">
              <input type="checkbox" checked={form.is_directory_visible} onChange={e => set('is_directory_visible', e.target.checked)} className="w-4 h-4" />
              Visible in Directory
            </label>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Admin Notes (private)</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={2}
              className="w-full font-body text-sm rounded-md border border-input bg-background px-3 py-2 resize-none"
              placeholder="Pastoral notes, follow-up reminders…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-body">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 font-body bg-primary">
              {saving ? 'Saving…' : isNew ? 'Add Member' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}