import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, X, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const DEFAULT_ALLOCATIONS = [
  { name: 'Ministry & Worship', percentage: 30, color: 'hsl(224, 52%, 23%)', sort_order: 1 },
  { name: 'Community Programs', percentage: 20, color: 'hsl(38, 45%, 60%)', sort_order: 2 },
  { name: 'Staff & Operations', percentage: 25, color: 'hsl(224, 30%, 50%)', sort_order: 3 },
  { name: 'Missions & Outreach', percentage: 15, color: 'hsl(38, 60%, 75%)', sort_order: 4 },
  { name: 'Building & Maintenance', percentage: 10, color: 'hsl(224, 20%, 70%)', sort_order: 5 },
];

export default function AnnualFundSettings() {
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [newRow, setNewRow] = useState({ name: '', color: '#2a3f6e', percentage: '' });
  const [seeding, setSeeding] = useState(false);

  // Fetch annual fund settings
  const { data: fundSettings } = useQuery({
    queryKey: ['fundSettings', 'annual_fund'],
    queryFn: async () => {
      const result = await base44.entities.FundSettings.filter({ slug: 'annual_fund' });
      return result[0] || null;
    }
  });

  // Fetch budget allocations
  const { data: budgetAllocations = [] } = useQuery({
    queryKey: ['budgetAllocations'],
    queryFn: () => base44.entities.BudgetAllocation.list('-sort_order')
  });

  useEffect(() => {
    if (fundSettings?.goal) setGoal(fundSettings.goal.toString());
    if (budgetAllocations.length > 0) setAllocations(budgetAllocations);
  }, [fundSettings, budgetAllocations]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const goalNum = parseFloat(goal) || 0;
      if (fundSettings?.id) {
        await base44.entities.FundSettings.update(fundSettings.id, { goal: goalNum });
      } else {
        await base44.entities.FundSettings.create({
          name: 'Annual Fund',
          slug: 'annual_fund',
          goal: goalNum,
          is_active: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fundSettings'] });
    }
  });

  const allocationMutation = useMutation({
    mutationFn: async (allocData) => {
      if (allocData.id) {
        await base44.entities.BudgetAllocation.update(allocData.id, allocData);
      } else {
        await base44.entities.BudgetAllocation.create(allocData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
      setNewRow({ name: '', color: '#2a3f6e', percentage: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BudgetAllocation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    }
  });

  const handleAddAllocation = () => {
    if (newRow.name && newRow.percentage) {
      allocationMutation.mutate({
        name: newRow.name,
        color: newRow.color,
        percentage: parseFloat(newRow.percentage),
        sort_order: allocations.length
      });
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    for (const item of DEFAULT_ALLOCATIONS) {
      await base44.entities.BudgetAllocation.create(item);
    }
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
    setSeeding(false);
  };

  // Calculate progress metrics
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const pctOfYear = Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100);

  const goalNum = parseFloat(goal) || 0;
  const currentNum = parseFloat(current) || 0;
  const pctRaised = goalNum > 0 ? Math.round((currentNum / goalNum) * 100) : 0;

  const diff = pctRaised - pctOfYear;
  const isAhead = diff > 2;
  const isBehind = diff < -2;
  const targetAmount = Math.round((pctOfYear / 100) * goalNum);
  const absDiff = Math.abs(currentNum - targetAmount);

  const allocTotal = allocations.reduce((sum, a) => sum + (a.percentage || 0), 0);
  const allocValid = Math.abs(allocTotal - 100) < 0.1;

  return (
    <div className="space-y-6">
      {/* Goal & Progress */}
      <div>
        <h3 className="font-heading text-lg text-primary mb-4">Annual Fund Settings</h3>
        <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Annual Goal ($)</Label>
              <Input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="250000"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Contributions to Date ($)</Label>
              <Input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="187000"
                className="font-body"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
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

          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="font-body gap-2">
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Budget Allocation Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-primary">Budget Allocation</h3>
          {allocations.length === 0 && (
            <Button variant="outline" size="sm" onClick={handleSeedDefaults} disabled={seeding}>
              Load Defaults
            </Button>
          )}
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
          <div className="space-y-3">
            {allocations.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-secondary/30">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="color"
                    value={item.color || '#2a3f6e'}
                    onChange={(e) => allocationMutation.mutate({ ...item, color: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border border-border"
                  />
                  <input
                    className="flex-1 font-body text-sm bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 outline-none"
                    value={item.name}
                    onChange={(e) => allocationMutation.mutate({ ...item, name: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-16 font-body text-sm bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 outline-none text-right"
                    value={item.percentage}
                    onChange={(e) => allocationMutation.mutate({ ...item, percentage: parseFloat(e.target.value) })}
                  />
                  <span className="font-body text-xs text-muted-foreground w-4">%</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Row */}
          {!newRow.name ? (
            <Button variant="outline" size="sm" className="w-full" onClick={() => setNewRow({ name: '', color: '#2a3f6e', percentage: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border bg-secondary/20 gap-3">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="color"
                  value={newRow.color}
                  onChange={(e) => setNewRow(r => ({ ...r, color: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border border-border"
                />
                <input
                  className="flex-1 font-body text-sm bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 outline-none"
                  placeholder="Category name"
                  value={newRow.name}
                  onChange={(e) => setNewRow(r => ({ ...r, name: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2 ml-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-16 font-body text-sm bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 outline-none text-right"
                  placeholder="0"
                  value={newRow.percentage}
                  onChange={(e) => setNewRow(r => ({ ...r, percentage: e.target.value }))}
                />
                <span className="font-body text-xs text-muted-foreground w-4">%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddAllocation()}
                  disabled={allocationMutation.isPending || !newRow.name || !newRow.percentage}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNewRow({ name: '', color: '#2a3f6e', percentage: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Total Status */}
          {allocations.length > 0 && (
            <>
              {!allocValid && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm font-body">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Total is {allocTotal.toFixed(1)}% — must equal 100% to display correctly on the chart.
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30">
                <span className="font-body text-sm font-semibold">Total</span>
                <span className={`font-body text-sm font-semibold ${allocValid ? 'text-green-600' : 'text-destructive'}`}>
                  {allocTotal.toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}