import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Pencil, Plus, X, Check } from 'lucide-react';
import { toast } from "sonner";

const ICONS = ["BookOpen", "Cross", "Heart", "Globe", "Users", "Zap", "Star", "Church", "Flame", "Shield"];

const emptyForm = { title: '', summary: '', detail: '', icon: 'BookOpen', sort_order: 99 };

export default function BeliefsManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);

  const { data: beliefs = [] } = useQuery({
    queryKey: ['beliefs'],
    queryFn: () => base44.entities.Belief.list('sort_order', 50),
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await base44.entities.Belief.update(editingId, form);
      toast.success("Belief updated!");
      setEditingId(null);
    } else {
      await base44.entities.Belief.create(form);
      toast.success("Belief added!");
      setShowAdd(false);
    }
    setForm(emptyForm);
    queryClient.invalidateQueries({ queryKey: ['beliefs'] });
  };

  const handleEdit = (belief) => {
    setEditingId(belief.id);
    setShowAdd(false);
    setForm({
      title: belief.title || '',
      summary: belief.summary || '',
      detail: belief.detail || '',
      icon: belief.icon || 'BookOpen',
      sort_order: belief.sort_order ?? 99,
    });
  };

  const handleDelete = async (id) => {
    await base44.entities.Belief.delete(id);
    toast.success("Deleted");
    queryClient.invalidateQueries({ queryKey: ['beliefs'] });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const BeliefForm = ({ submitLabel }) => (
    <form onSubmit={handleSave} className="space-y-3 bg-secondary/30 rounded-xl p-4 border border-border/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1 sm:col-span-2">
          <Label className="font-body text-xs">Title *</Label>
          <Input value={form.title} onChange={e => updateField('title', e.target.value)} required className="font-body text-sm" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label className="font-body text-xs">Summary (header line) *</Label>
          <Input value={form.summary} onChange={e => updateField('summary', e.target.value)} required className="font-body text-sm" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label className="font-body text-xs">Full Detail *</Label>
          <Textarea value={form.detail} onChange={e => updateField('detail', e.target.value)} required rows={3} className="font-body text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="font-body text-xs">Icon</Label>
          <Select value={form.icon} onValueChange={v => updateField('icon', v)}>
            <SelectTrigger className="font-body text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ICONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-body text-xs">Sort Order</Label>
          <Input type="number" value={form.sort_order} onChange={e => updateField('sort_order', Number(e.target.value))} className="font-body text-sm" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={handleCancel} className="font-body">
          <X className="w-3.5 h-3.5 mr-1" /> Cancel
        </Button>
        <Button type="submit" size="sm" className="font-body bg-primary">
          <Check className="w-3.5 h-3.5 mr-1" /> {submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-primary">Doctrinal Beliefs</h3>
        {!showAdd && !editingId && (
          <Button size="sm" className="font-body gap-1" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Add Belief
          </Button>
        )}
      </div>

      {showAdd && <BeliefForm submitLabel="Add Belief" />}

      <div className="space-y-2">
        {beliefs.map(belief => (
          <div key={belief.id}>
            {editingId === belief.id ? (
              <BeliefForm submitLabel="Save Changes" />
            ) : (
              <div className="flex items-start justify-between p-4 bg-card rounded-lg border border-border/50">
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-base text-primary">{belief.title}</h4>
                  <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">{belief.summary}</p>
                </div>
                <div className="flex items-center gap-1 ml-3 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(belief)}>
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(belief.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {beliefs.length === 0 && (
          <p className="font-body text-muted-foreground text-center py-8">No beliefs added yet.</p>
        )}
      </div>
    </div>
  );
}