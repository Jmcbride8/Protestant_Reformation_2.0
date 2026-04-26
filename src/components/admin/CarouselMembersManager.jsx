import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Pencil, X, Save, Image } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  name: '',
  profession: '',
  image_url: '',
  short_quote: '',
  testimony: '',
  why_hope: '',
  sort_order: 0,
  is_active: true,
};

export default function CarouselMembersManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, 'new' = new form, or record object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['carouselMembers'],
    queryFn: () => base44.entities.CarouselMember.list('sort_order', 50),
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => {
    setForm({ ...EMPTY_FORM, sort_order: members.length });
    setEditing('new');
  };

  const openEdit = (member) => {
    setForm({
      name: member.name || '',
      profession: member.profession || '',
      image_url: member.image_url || '',
      short_quote: member.short_quote || '',
      testimony: member.testimony || '',
      why_hope: member.why_hope || '',
      sort_order: member.sort_order ?? 0,
      is_active: member.is_active ?? true,
    });
    setEditing(member);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.short_quote.trim()) {
      toast.error('Name and short quote are required.');
      return;
    }
    setSaving(true);
    if (editing === 'new') {
      await base44.entities.CarouselMember.create(form);
      toast.success('Card added!');
    } else {
      await base44.entities.CarouselMember.update(editing.id, form);
      toast.success('Card updated!');
    }
    queryClient.invalidateQueries({ queryKey: ['carouselMembers'] });
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.CarouselMember.delete(id);
    queryClient.invalidateQueries({ queryKey: ['carouselMembers'] });
    toast.success('Card deleted.');
  };

  const handleToggleActive = async (member) => {
    await base44.entities.CarouselMember.update(member.id, { is_active: !member.is_active });
    queryClient.invalidateQueries({ queryKey: ['carouselMembers'] });
  };

  if (isLoading) return <div className="py-8 text-center font-body text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-primary">Who You'll Meet — Carousel Cards</h3>
        <Button onClick={openNew} className="font-body gap-2 bg-primary">
          <Plus className="w-4 h-4" /> Add Card
        </Button>
      </div>

      {/* Form */}
      {editing !== null && (
        <div className="bg-secondary/30 border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-lg text-primary">{editing === 'new' ? 'New Card' : 'Edit Card'}</h4>
            <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Name *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. The Rivera Family" className="font-body" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Subtitle / Profession</Label>
              <Input value={form.profession} onChange={e => set('profession', e.target.value)} placeholder="e.g. Carlos, Maria & their four kids" className="font-body" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Short Quote * (shown on the card)</Label>
            <Textarea value={form.short_quote} onChange={e => set('short_quote', e.target.value)} placeholder="One-liner quote shown on the carousel card" className="font-body h-20" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Full Testimony (shown in the detail dialog)</Label>
            <Textarea value={form.testimony} onChange={e => set('testimony', e.target.value)} placeholder="Longer story shown when user clicks the card" className="font-body h-28" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Why Hope Church?</Label>
            <Textarea value={form.why_hope} onChange={e => set('why_hope', e.target.value)} placeholder="Why did they choose Hope Church?" className="font-body h-20" />
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Photo</Label>
            <div className="flex gap-3 items-center">
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="w-16 h-20 object-cover rounded-lg border border-border" />
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background font-body text-sm hover:bg-secondary transition-colors">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    {uploading ? 'Uploading…' : 'Upload Photo'}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                <Input
                  value={form.image_url}
                  onChange={e => set('image_url', e.target.value)}
                  placeholder="…or paste an image URL"
                  className="font-body text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} className="font-body w-24" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
              <Label className="font-body text-sm">Active (visible on site)</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving || uploading} className="font-body gap-2 bg-primary">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Card'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-body">Cancel</Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {members.length === 0 && (
          <p className="font-body text-muted-foreground text-center py-8">No carousel cards yet. Click "Add Card" to create the first one.</p>
        )}
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/50">
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="w-14 h-18 object-cover rounded-lg border border-border shrink-0" style={{ height: '72px' }} />
            ) : (
              <div className="w-14 shrink-0 bg-secondary rounded-lg flex items-center justify-center" style={{ height: '72px' }}>
                <Image className="w-6 h-6 text-muted-foreground/40" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-heading text-base text-primary truncate">{member.name}</h4>
                {!member.is_active && (
                  <span className="font-body text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Hidden</span>
                )}
              </div>
              {member.profession && <p className="font-body text-xs text-muted-foreground truncate">{member.profession}</p>}
              <p className="font-body text-xs text-foreground/70 mt-1 line-clamp-1 italic">"{member.short_quote}"</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Switch
                checked={member.is_active}
                onCheckedChange={() => handleToggleActive(member)}
                className="scale-90"
              />
              <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                <Pencil className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}