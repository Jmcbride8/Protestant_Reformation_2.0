import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

const PRESET_COLORS = [
  'hsl(224, 52%, 23%)',
  'hsl(38, 45%, 60%)',
  'hsl(224, 30%, 50%)',
  'hsl(38, 60%, 75%)',
  'hsl(224, 20%, 70%)',
  'hsl(160, 40%, 45%)',
  'hsl(0, 60%, 55%)',
];

const DEFAULT_ALLOCATIONS = [
  { name: 'Ministry & Worship', percentage: 30, color: PRESET_COLORS[0], sort_order: 1 },
  { name: 'Community Programs', percentage: 20, color: PRESET_COLORS[1], sort_order: 2 },
  { name: 'Staff & Operations', percentage: 25, color: PRESET_COLORS[2], sort_order: 3 },
  { name: 'Missions & Outreach', percentage: 15, color: PRESET_COLORS[3], sort_order: 4 },
  { name: 'Building & Maintenance', percentage: 10, color: PRESET_COLORS[4], sort_order: 5 },
];

export default function BudgetManager() {
  const queryClient = useQueryClient();
  const [newRow, setNewRow] = useState({ name: '', percentage: '', color: PRESET_COLORS[0] });
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const { data: allocations = [], isLoading } = useQuery({
    queryKey: ['budgetAllocations'],
    queryFn: () => base44.entities.BudgetAllocation.list('sort_order', 50),
  });

  const total = allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const handleSeedDefaults = async () => {
    setSeeding(true);
    for (const item of DEFAULT_ALLOCATIONS) {
      await base44.entities.BudgetAllocation.create(item);
    }
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    toast.success("Default budget loaded");
    setSeeding(false);
  };

  const handleUpdate = async (id, field, value) => {
    await base44.entities.BudgetAllocation.update(id, { [field]: field === 'percentage' ? Number(value) : value });
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
  };

  const handleDelete = async (id) => {
    await base44.entities.BudgetAllocation.delete(id);
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    toast.success("Category removed");
  };

  const handleAdd = async () => {
    if (!newRow.name || !newRow.percentage) return;
    setSaving(true);
    await base44.entities.BudgetAllocation.create({
      name: newRow.name,
      percentage: Number(newRow.percentage),
      color: newRow.color,
      sort_order: allocations.length + 1,
    });
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    setNewRow({ name: '', percentage: '', color: PRESET_COLORS[allocations.length % PRESET_COLORS.length] });
    toast.success("Category added");
    setSaving(false);
  };

  if (isLoading) return <div className="py-8 text-center font-body text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl text-primary">Budget Allocations</h3>
          <p className="font-body text-sm text-muted-foreground">These percentages appear on the Giving page chart.</p>
        </div>
        {allocations.length === 0 && (
          <Button variant="outline" size="sm" className="font-body text-xs" onClick={handleSeedDefaults} disabled={seeding}>
            Load Defaults
          </Button>
        )}
      </div>

      {!isValid && allocations.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm font-body">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Total is {total.toFixed(1)}% — must equal 100% to display correctly on the chart.
        </div>
      )}

      {/* Existing rows */}
      <div className="space-y-2">
        {allocations.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
            <input
              type="color"
              value={item.color?.startsWith('hsl') ? '#2a3f6e' : item.color || '#2a3f6e'}
              onChange={(e) => handleUpdate(item.id, 'color', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border flex-shrink-0"
              title="Pick color"
            />
            <input
              className="flex-1 font-body text-sm bg-transparent border-b border-border/50 focus:border-primary outline-none pb-0.5 min-w-0"
              value={item.name}
              onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="w-16 font-body text-sm bg-transparent border-b border-border/50 focus:border-primary outline-none text-right pb-0.5"
                value={item.percentage}
                onChange={(e) => handleUpdate(item.id, 'percentage', e.target.value)}
              />
              <span className="font-body text-sm text-muted-foreground">%</span>
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Total */}
      {allocations.length > 0 && (
        <div className={`flex justify-end font-body text-sm font-semibold ${isValid ? 'text-green-600' : 'text-destructive'}`}>
          Total: {total.toFixed(1)}% {isValid ? '✓' : '(must be 100%)'}
        </div>
      )}

      {/* Add new row */}
      <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border space-y-3">
        <p className="font-body text-sm font-medium text-primary">Add Category</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={newRow.color?.startsWith('hsl') ? '#2a3f6e' : newRow.color || '#2a3f6e'}
            onChange={(e) => setNewRow(r => ({ ...r, color: e.target.value }))}
            className="w-8 h-8 rounded cursor-pointer border border-border flex-shrink-0"
          />
          <Input
            placeholder="Category name"
            value={newRow.name}
            onChange={(e) => setNewRow(r => ({ ...r, name: e.target.value }))}
            className="font-body text-sm flex-1"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={newRow.percentage}
              onChange={(e) => setNewRow(r => ({ ...r, percentage: e.target.value }))}
              className="font-body text-sm w-20 text-right"
            />
            <span className="font-body text-sm text-muted-foreground">%</span>
          </div>
          <Button size="sm" className="font-body gap-1 flex-shrink-0" onClick={handleAdd} disabled={saving || !newRow.name || !newRow.percentage}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}