import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Plus } from 'lucide-react';
import { toast } from "sonner";

const iconOptions = ['Cross', 'UtensilsCrossed', 'BookOpen', 'HeartHandshake'];

export default function ScheduleManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ event: '', day: '', time: '', icon_name: 'Cross', sort_order: 0 });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['scheduleItems'],
    queryFn: () => base44.entities.ScheduleItem.list('sort_order', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScheduleItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      resetForm();
      toast.success('Schedule item added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScheduleItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      resetForm();
      toast.success('Schedule item updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScheduleItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      toast.success('Schedule item deleted');
    },
  });

  const resetForm = () => {
    setFormData({ event: '', day: '', time: '', icon_name: 'Cross', sort_order: 0 });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.event || !formData.day || !formData.time) {
      toast.error('Please fill in all fields');
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
        <h3 className="font-heading text-xl text-primary">Weekly Schedule</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-body gap-2">
          <Plus className="w-4 h-4" /> Add Schedule Item
        </Button>
      </div>

      {showForm && (
        <div className="p-6 bg-card rounded-lg border border-border/50 space-y-4">
          <Input
            placeholder="Event name"
            value={formData.event}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            className="font-body"
          />
          <Input
            placeholder="Day (e.g. Sunday)"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className="font-body"
          />
          <Input
            placeholder="Time (e.g. 9:00 AM)"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="font-body"
          />
          <Select value={formData.icon_name} onValueChange={(val) => setFormData({ ...formData, icon_name: val })}>
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Sort order"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="font-body"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="font-body bg-primary">
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
              <h4 className="font-heading text-base text-primary">{item.event}</h4>
              <p className="font-body text-xs text-muted-foreground">{item.day} • {item.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-body text-xs">{item.icon_name}</Badge>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="font-body text-muted-foreground text-center py-8">No schedule items yet.</p>}
      </div>
    </div>
  );
}