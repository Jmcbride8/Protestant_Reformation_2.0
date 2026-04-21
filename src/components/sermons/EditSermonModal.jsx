import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

const parseYoutubeId = (input) => {
  const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : input.trim();
};

export default function EditSermonModal({ sermon, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', speaker: '', date: '', youtube_id: '',
    series: '', scripture_reference: '', description: '', is_featured: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sermon) setForm({ ...sermon });
  }, [sermon]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const youtubeId = parseYoutubeId(form.youtube_id);
    await base44.entities.Sermon.update(sermon.id, { ...form, youtube_id: youtubeId });
    toast.success("Sermon updated!");
    setSaving(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Dialog open={!!sermon} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary">Edit Sermon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-body text-sm">Sermon Title *</Label>
              <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} required className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Speaker *</Label>
              <Input value={form.speaker} onChange={(e) => updateField('speaker', e.target.value)} required className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Date *</Label>
              <Input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} required className="font-body" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-body text-sm">YouTube URL or Video ID *</Label>
              <Input value={form.youtube_id} onChange={(e) => updateField('youtube_id', e.target.value)} required className="font-body" />
              <p className="font-body text-xs text-muted-foreground">Paste the full YouTube URL or just the video ID</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Series Name</Label>
              <Input value={form.series} onChange={(e) => updateField('series', e.target.value)} className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Scripture Reference</Label>
              <Input value={form.scripture_reference} onChange={(e) => updateField('scripture_reference', e.target.value)} className="font-body" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-body text-sm">Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={2} className="font-body" />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={!!form.is_featured}
                onCheckedChange={(checked) => updateField('is_featured', checked)}
                id="edit_is_featured"
              />
              <Label htmlFor="edit_is_featured" className="font-body text-sm cursor-pointer">Pin as Featured Sermon</Label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-body flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="font-body flex-1 bg-primary hover:bg-primary/90">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}