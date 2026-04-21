import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export default function AddSermonForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', speaker: '', date: '', youtube_id: '',
    series: '', scripture_reference: '', description: '', is_featured: false,
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Parse a full YouTube URL into just the video ID
  const parseYoutubeId = (input) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return input.trim(); // assume it's already an ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const youtubeId = parseYoutubeId(form.youtube_id);
    await base44.entities.Sermon.create({ ...form, youtube_id: youtubeId });
    toast.success("Sermon added!");
    setForm({ title: '', speaker: '', date: '', youtube_id: '', series: '', scripture_reference: '', description: '', is_featured: false });
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
      <h3 className="font-heading text-xl text-primary">Add a Sermon</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">Sermon Title *</Label>
          <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. When God Seems Silent" required className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Speaker *</Label>
          <Input value={form.speaker} onChange={(e) => updateField('speaker', e.target.value)} placeholder="Pastor Name" required className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Date *</Label>
          <Input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} required className="font-body" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">YouTube URL or Video ID *</Label>
          <Input value={form.youtube_id} onChange={(e) => updateField('youtube_id', e.target.value)} placeholder="https://www.youtube.com/watch?v=... or video ID" required className="font-body" />
          <p className="font-body text-xs text-muted-foreground">Paste the full YouTube URL or just the video ID (e.g. dQw4w9WgXcQ)</p>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Series Name</Label>
          <Input value={form.series} onChange={(e) => updateField('series', e.target.value)} placeholder="e.g. The Psalms" className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Scripture Reference</Label>
          <Input value={form.scripture_reference} onChange={(e) => updateField('scripture_reference', e.target.value)} placeholder="e.g. Psalm 23:1-6" className="font-body" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">Description</Label>
          <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="A short summary of the sermon..." rows={2} className="font-body" />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <Switch
            checked={form.is_featured}
            onCheckedChange={(checked) => updateField('is_featured', checked)}
            id="is_featured"
          />
          <Label htmlFor="is_featured" className="font-body text-sm cursor-pointer">Pin as Featured Sermon</Label>
        </div>
      </div>

      <Button type="submit" className="w-full font-body bg-primary hover:bg-primary/90">
        Add Sermon
      </Button>
    </form>
  );
}