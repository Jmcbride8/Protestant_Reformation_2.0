import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Pencil, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const categories = ['worship', 'community', 'celebration', 'outreach', 'youth', 'family', 'seasonal', 'other'];

export default function MemoriesManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'community',
    media_urls: [],
    sort_order: 0,
    is_active: true,
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['adminMemories'],
    queryFn: () => base44.entities.Memory.list('-sort_order'),
  });

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'community',
      media_urls: [],
      sort_order: 0,
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (memory) => {
    setFormData(memory);
    setEditingId(memory.id);
    setShowForm(true);
  };

  const handleAddMedia = async (e) => {
    const files = e.target.files;
    if (!files) return;

    for (let file of files) {
      try {
        const result = await base44.integrations.Core.UploadFile({ file });
        setFormData(prev => ({
          ...prev,
          media_urls: [...(prev.media_urls || []), result.file_url]
        }));
        toast.success('Media uploaded');
      } catch (error) {
        toast.error('Upload failed');
      }
    }
  };

  const handleRemoveMedia = (url) => {
    setFormData(prev => ({
      ...prev,
      media_urls: (prev.media_urls || []).filter(u => u !== url)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Title and date are required');
      return;
    }

    try {
      if (editingId) {
        await base44.entities.Memory.update(editingId, formData);
        toast.success('Memory updated');
      } else {
        await base44.entities.Memory.create(formData);
        toast.success('Memory created');
      }
      queryClient.invalidateQueries({ queryKey: ['adminMemories'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      handleReset();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      await base44.entities.Memory.delete(id);
      queryClient.invalidateQueries({ queryKey: ['adminMemories'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success('Memory deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl text-primary">
              {editingId ? 'Edit Memory' : 'Create Memory'}
            </h3>
            <button onClick={handleReset} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-medium mb-2 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Easter Sunrise Service"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium mb-2 block">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-medium mb-2 block">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-body text-sm font-medium mb-2 block">Sort Order</label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this memory..."
                rows={3}
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="font-body text-sm font-medium mb-2 block">Photos & Videos</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleAddMedia}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="font-body text-sm text-muted-foreground">
                      Click to upload photos or videos
                    </span>
                  </div>
                </label>
              </div>

              {/* Media Preview */}
              {formData.media_urls && formData.media_urls.length > 0 && (
                <div className="mt-4">
                  <p className="font-body text-sm font-medium mb-2">Uploaded ({formData.media_urls.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {formData.media_urls.map((url, i) => (
                      <div key={i} className="relative group">
                        {url.match(/\.(mp4|webm|mov)$/i) ? (
                          <div className="bg-secondary rounded aspect-square flex items-center justify-center text-xs text-muted-foreground">
                            Video
                          </div>
                        ) : (
                          <img src={url} alt="Preview" className="w-full h-24 object-cover rounded" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(url)}
                          className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground">
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl text-primary">All Memories</h3>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              New Memory
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {memories.map(memory => (
            <div key={memory.id} className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-heading text-base text-primary">{memory.title}</h4>
                    <Badge className={`text-xs capitalize ${memory.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {memory.category}
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-1">
                    {format(new Date(memory.date + 'T00:00:00'), 'MMM d, yyyy')}
                  </p>
                  {memory.description && (
                    <p className="font-body text-sm text-muted-foreground line-clamp-2">
                      {memory.description}
                    </p>
                  )}
                  <p className="font-body text-xs text-muted-foreground/60 mt-1">
                    {memory.media_urls?.length || 0} media item{memory.media_urls?.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(memory)}
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(memory.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {memories.length === 0 && (
            <p className="font-body text-muted-foreground text-center py-8">
              No memories created yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}