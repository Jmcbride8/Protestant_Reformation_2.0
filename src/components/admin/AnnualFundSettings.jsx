import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, X } from 'lucide-react';

export default function AnnualFundSettings() {
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [newRow, setNewRow] = useState({ name: '', color: '#2a3f6e', percentage: '' });

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

  const allocTotal = allocations.reduce((sum, a) => sum + (a.percentage || 0), 0);
  const allocValid = Math.abs(allocTotal - 100) < 0.1;

  return (
    <div className="space-y-6">
      {/* Goal Setting */}
      <div>
        <h3 className="font-heading text-lg text-primary mb-4">Annual Goal</h3>
        <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
          <div className="max-w-sm">
            <Label className="font-body text-sm mb-2 block">Annual Goal ($)</Label>
            <Input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="250000"
              className="font-body"
            />
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="font-body gap-2">
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save Goal'}
          </Button>
        </div>
      </div>

      {/* Budget Allocation Breakdown */}
      <div>
        <h3 className="font-heading text-lg text-primary mb-4">Budget Allocation</h3>
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
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30">
              <span className="font-body text-sm font-semibold">Total</span>
              <span className={`font-body text-sm font-semibold ${allocValid ? 'text-green-600' : 'text-destructive'}`}>
                {allocTotal.toFixed(1)}% {!allocValid && <span className="text-xs">(must be 100%)</span>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}