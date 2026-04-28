import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function EditProfilePanel({ profile, user, onClose }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    phone: profile?.phone || '',
    spiritual_gifts: profile?.spiritual_gifts?.join(', ') || '',
    interests: profile?.interests?.join(', ') || '',
    photo_url: profile?.photo_url || '',
  });
  const [photoPreview, setPhotoPreview] = useState(profile?.photo_url || null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    // Local preview immediately
    setPhotoPreview(URL.createObjectURL(file));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(f => ({ ...f, photo_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (profile?.id) {
        return base44.entities.MemberProfile.update(profile.id, data);
      } else {
        // Create a new profile linked by email
        return base44.entities.MemberProfile.create({
          full_name: user.full_name,
          email: user.email,
          ...data,
        });
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
      phone: form.phone,
      photo_url: form.photo_url,
      spiritual_gifts: form.spiritual_gifts
        ? form.spiritual_gifts.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      interests: form.interests
        ? form.interests.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 mt-4 space-y-5">

      {/* Photo Upload */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-accent/40 flex items-center justify-center shrink-0 shadow-lg">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-7 h-7 text-primary/40" />
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

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Phone</Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. 805-555-0101"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Spiritual Gifts <span className="text-muted-foreground/60">(comma separated)</span></Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. Teaching, Hospitality"
            value={form.spiritual_gifts}
            onChange={e => setForm(f => ({ ...f, spiritual_gifts: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="font-body text-xs text-muted-foreground">Interests <span className="text-muted-foreground/60">(comma separated)</span></Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. Hiking, Coffee, Photography"
            value={form.interests}
            onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
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