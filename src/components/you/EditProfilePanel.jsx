import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Check, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Simple tag input for family members
function FamilyMembersInput({ values = [], onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground font-body text-xs px-2 py-0.5 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(values.filter(x => x !== v))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Add name and press Enter…"
          className="font-body text-sm flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

const MILESTONES = [
  { key: 'followed_jesus', label: 'Followed Jesus' },
  { key: 'baptized', label: 'Baptized' },
  { key: 'confirmed', label: 'Membership Class / Confirmed' },
  { key: 'serving', label: 'Actively Serving' },
];

export default function EditProfilePanel({ profile, user, onClose }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name || user?.full_name || '',
    email: profile?.email || user?.email || '',
    secondary_email: profile?.secondary_email || '',
    phone: profile?.phone || '',
    photo_url: profile?.photo_url || '',
    family_members: profile?.family_members || [],
    followed_jesus: profile?.followed_jesus || false,
    baptized: profile?.baptized || false,
    confirmed: profile?.confirmed || false,
    serving: profile?.serving || false,
    interests: profile?.interests?.join(', ') || '',
  });
  const [photoPreview, setPhotoPreview] = useState(profile?.photo_url || null);
  const [uploading, setUploading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setPhotoPreview(URL.createObjectURL(file));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('photo_url', file_url);
    setUploading(false);
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (profile?.id) {
        return base44.entities.MemberProfile.update(profile.id, data);
      } else {
        return base44.entities.MemberProfile.create({ ...data, email: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile', user.email] });
      toast({ title: 'Profile updated!' });
      onClose();
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      full_name: form.full_name,
      email: form.email,
      secondary_email: form.secondary_email,
      phone: form.phone,
      photo_url: form.photo_url,
      family_members: form.family_members,
      followed_jesus: form.followed_jesus,
      baptized: form.baptized,
      confirmed: form.confirmed,
      serving: form.serving,
      interests: form.interests ? form.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
    });
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 mt-4 space-y-6">

      {/* Photo Upload */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-accent/40 flex items-center justify-center shrink-0 shadow-lg">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-primary/40" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-foreground mb-1">Profile Photo</p>
          <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Change Photo'}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Contact Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body text-xs text-muted-foreground">Full Name</Label>
            <Input className="font-body text-sm" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs text-muted-foreground">Email</Label>
            <Input className="font-body text-sm" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs text-muted-foreground">Secondary Email</Label>
            <Input className="font-body text-sm" type="email" placeholder="Optional" value={form.secondary_email} onChange={e => set('secondary_email', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs text-muted-foreground">Phone</Label>
            <Input className="font-body text-sm" placeholder="e.g. 805-555-0101" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Family Members</p>
        <FamilyMembersInput values={form.family_members} onChange={v => set('family_members', v)} />
        <p className="font-body text-xs text-muted-foreground mt-1">Other household members who also attend Hope Church.</p>
      </div>

      {/* Life Milestones */}
      <div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Life Milestones</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MILESTONES.map(m => (
            <label key={m.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form[m.key]}
                onChange={e => set(m.key, e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Interests</p>
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Interests <span className="text-muted-foreground/60">(comma separated)</span></Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. Hiking, Coffee, Photography"
            value={form.interests}
            onChange={e => set('interests', e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" className="font-body text-xs" onClick={onClose}>
          <X className="w-3.5 h-3.5 mr-1" /> Cancel
        </Button>
        <Button size="sm" className="font-body text-xs bg-primary" onClick={handleSave} disabled={saveMutation.isPending || uploading}>
          {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}