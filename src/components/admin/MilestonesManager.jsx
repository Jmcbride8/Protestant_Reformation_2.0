import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Plus, Upload } from 'lucide-react';
import { toast } from "sonner";

export default function MilestonesManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', cta: '', image_url: '', sort_order: 0 });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['milestones'],
    queryFn: () => base44.entities.Milestone.list('sort_order', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Milestone.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      resetForm();
      toast.success('Milestone added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Milestone.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      resetForm();
      toast.success('Milestone updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Milestone.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success('Milestone deleted');
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', cta: '', image_url: '', sort_order: 0 });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.cta || !formData.image_url) {
      toast.error('Please fill in all fields and upload an image');
      return;
    }
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-primary">Milestones</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-body gap-2">
          <Plus className="w-4 h-4" /> Add Milestone
        </Button>
      </div>

      {showForm && (
        <div className="p-6 bg-card rounded-lg border border-border/50 space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="font-body"
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="font-body"
          />
          <Input
            placeholder="Call-to-action text"
            value={formData.cta}
            onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
            className="font-body"
          />
          <div className="space-y-2">
            <label className="font-body text-sm text-muted-foreground">Image</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="font-body text-sm flex-1 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground cursor-pointer"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="preview" className="w-12 h-12 rounded object-cover" />
              )}
            </div>
          </div>
          <Input
            type="number"
            placeholder="Sort order"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="font-body"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={uploading} className="font-body bg-primary">
              {editingItem ? 'Update' : 'Add'}
            </Button>
            <Button onClick={resetForm} variant="outline" className="font-body">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
            <div className="flex-1">
              <h4 className="font-heading text-base text-primary">{item.title}</h4>
              <p className="font-body text-xs text-muted-foreground">{item.cta}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.image_url && <img src={item.image_url} alt={item.title} className="w-8 h-8 rounded object-cover" />}
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="font-body text-muted-foreground text-center py-8">No milestones yet.</p>}
      </div>
    </div>
  );
}