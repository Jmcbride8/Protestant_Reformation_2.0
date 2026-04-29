import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, Save, Trash2, Plus, AlertCircle } from 'lucide-react';

const FUND_KEY = 'annual_fund';
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

export default function GivingManager() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['fundSettings'],
    queryFn: () => base44.entities.FundSettings.filter({ key: FUND_KEY }),
  });

  const { data: allocations = [], isLoading: allocLoading } = useQuery({
    queryKey: ['budgetAllocations'],
    queryFn: () => base44.entities.BudgetAllocation.list('sort_order', 50),
  });

  const record = settings[0] || null;

  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [saving, setSaving] = useState(false);
  const [newRow, setNewRow] = useState({ name: '', percentage: '', color: PRESET_COLORS[0] });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (record) {
      setGoal(String(record.goal));
      setCurrent(String(record.current));
    } else {
      setGoal('250000');
      setCurrent('187000');
    }
  }, [record]);

  const handleSave = async () => {
    setSaving(true);
    const data = { key: FUND_KEY, goal: parseFloat(goal), current: parseFloat(current), label: 'Annual Fund' };
    if (record) {
      await base44.entities.FundSettings.update(record.id, data);
    } else {
      await base44.entities.FundSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['fundSettings'] });
    toast.success("Fund settings saved");
    setSaving(false);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    for (const item of DEFAULT_ALLOCATIONS) {
      await base44.entities.BudgetAllocation.create(item);
    }
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    toast.success("Default budget loaded");
    setSeeding(false);
  };

  const handleUpdateAllocation = async (id, field, value) => {
    await base44.entities.BudgetAllocation.update(id, { [field]: field === 'percentage' ? Number(value) : value });
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
  };

  const handleDeleteAllocation = async (id) => {
    await base44.entities.BudgetAllocation.delete(id);
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    toast.success("Category removed");
  };

  const handleAddAllocation = async () => {
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

  const goalNum = parseFloat(goal) || 0;
  const currentNum = parseFloat(current) || 0;
  const pctRaised = goalNum > 0 ? Math.round((currentNum / goalNum) * 100) : 0;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const pctOfYear = Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100);

  const diff = pctRaised - pctOfYear;
  const isAhead = diff > 2;
  const isBehind = diff < -2;
  const targetAmount = Math.round((pctOfYear / 100) * goalNum);
  const absDiff = Math.abs(currentNum - targetAmount);

  const allocTotal = allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0);
  const allocValid = Math.abs(allocTotal - 100) < 0.01;

  return (
    <div className="space-y-12">
      {/* Annual Fund Settings */}
      <div>
        <div>
          <h3 className="font-heading text-xl text-primary mb-1">Annual Fund Settings</h3>
          <p className="font-body text-sm text-muted-foreground">Update the goal and contributions-to-date shown on the Giving page.</p>
        </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="font-body text-sm">Annual Goal ($)</Label>
            <Input
              type="number"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="250000"
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Contributions to Date ($)</Label>
            <Input
              type="number"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="187000"
              className="font-body"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Live Preview</span>
            <span className="font-body text-xs text-muted-foreground">{pctOfYear}% through {now.getFullYear()}</span>
          </div>
          <div className="relative h-3 bg-border rounded-full overflow-hidden">
            <div className="absolute top-0 h-full w-0.5 bg-muted-foreground/50 z-10" style={{ left: `${pctOfYear}%` }} />
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(pctRaised, 100)}%`,
                backgroundColor: isAhead ? 'hsl(142, 60%, 40%)' : isBehind ? 'hsl(0, 72%, 55%)' : 'hsl(38, 45%, 60%)'
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isAhead ? <TrendingUp className="w-4 h-4 text-green-600" /> : isBehind ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-accent" />}
              <span className={`font-body text-sm font-semibold ${isAhead ? 'text-green-600' : isBehind ? 'text-red-500' : 'text-accent'}`}>
                {pctRaised}% raised
              </span>
              <span className="font-body text-xs text-muted-foreground">
                (${currentNum.toLocaleString()} of ${goalNum.toLocaleString()})
              </span>
            </div>
            <span className={`font-body text-xs font-medium ${isAhead ? 'text-green-600' : isBehind ? 'text-red-500' : 'text-accent'}`}>
              {isAhead ? `$${absDiff.toLocaleString()} ahead` : isBehind ? `$${absDiff.toLocaleString()} behind` : 'On track'}
            </span>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="font-body gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Budget Allocations */}
      <div>
        <div className="flex items-center justify-between mb-6">
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

        {!allocValid && allocations.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm font-body mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Total is {allocTotal.toFixed(1)}% — must equal 100% to display correctly on the chart.
          </div>
        )}

        {/* Existing allocations */}
        <div className="space-y-2 mb-6">
          {allocations.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
              <input
                type="color"
                value={item.color?.startsWith('hsl') ? '#2a3f6e' : item.color || '#2a3f6e'}
                onChange={(e) => handleUpdateAllocation(item.id, 'color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border flex-shrink-0"
                title="Pick color"
              />
              <input
                className="flex-1 font-body text-sm bg-transparent border-b border-border/50 focus:border-primary outline-none pb-0.5 min-w-0"
                value={item.name}
                onChange={(e) => handleUpdateAllocation(item.id, 'name', e.target.value)}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-16 font-body text-sm bg-transparent border-b border-border/50 focus:border-primary outline-none text-right pb-0.5"
                  value={item.percentage}
                  onChange={(e) => handleUpdateAllocation(item.id, 'percentage', e.target.value)}
                />
                <span className="font-body text-sm text-muted-foreground">%</span>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => handleDeleteAllocation(item.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Total */}
        {allocations.length > 0 && (
          <div className={`flex justify-end font-body text-sm font-semibold mb-6 ${allocValid ? 'text-green-600' : 'text-destructive'}`}>
            Total: {allocTotal.toFixed(1)}% {allocValid ? '✓' : '(must be 100%)'}
          </div>
        )}

        {/* Add new allocation */}
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
            <Button size="sm" className="font-body gap-1 flex-shrink-0" onClick={handleAddAllocation} disabled={saving || !newRow.name || !newRow.percentage}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}