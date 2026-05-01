import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, Save, Trash2, Plus, AlertCircle, Pencil, X, ChevronDown, ChevronUp, Check } from 'lucide-react';

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

const EMPTY_ITEM = { label: '', amount: '', description: '' };

function ItemizationEditor({ items = [], onChange }) {
  const [draft, setDraft] = useState(EMPTY_ITEM);
  const [editingIdx, setEditingIdx] = useState(null);

  const addItem = () => {
    if (!draft.label || !draft.amount) return;
    onChange([...items, { ...draft, amount: parseFloat(draft.amount) }]);
    setDraft(EMPTY_ITEM);
  };

  const updateItem = (idx, updated) => {
    const newItems = [...items];
    newItems[idx] = updated;
    onChange(newItems);
    setEditingIdx(null);
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <p className="font-body text-xs tracking-[0.18em] uppercase text-accent">Itemization Breakdown</p>

      {items.map((item, idx) => (
        <div key={idx}>
          {editingIdx === idx ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end bg-secondary/40 rounded-lg p-2">
              <Input
                className="font-body text-sm"
                value={item.label}
                onChange={e => updateItem(idx, { ...item, label: e.target.value })}
              />
              <Input
                className="font-body text-sm"
                type="number"
                value={item.amount}
                onChange={e => updateItem(idx, { ...item, amount: parseFloat(e.target.value) || 0 })}
              />
              <div className="flex gap-1">
                <Input
                  className="font-body text-sm flex-1"
                  placeholder="Note"
                  value={item.description || ''}
                  onChange={e => updateItem(idx, { ...item, description: e.target.value })}
                />
                <Button variant="ghost" size="icon" onClick={() => setEditingIdx(null)} className="h-8 w-8">
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-2 text-sm font-body">
              <span className="flex-1 text-foreground">{item.label}</span>
              <span className="text-muted-foreground">${parseFloat(item.amount).toLocaleString()}</span>
              {item.description && <span className="text-xs text-muted-foreground italic">— {item.description}</span>}
              <Button variant="ghost" size="icon" onClick={() => setEditingIdx(idx)} className="h-6 w-6">
                <Pencil className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="h-6 w-6">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div>
          <Label className="font-body text-xs text-muted-foreground">Line Item</Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. Staff Salaries"
            value={draft.label}
            onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
          />
        </div>
        <div>
          <Label className="font-body text-xs text-muted-foreground">Amount ($)</Label>
          <Input
            className="font-body text-sm"
            type="number"
            placeholder="e.g. 50000"
            value={draft.amount}
            onChange={e => setDraft(d => ({ ...d, amount: e.target.value }))}
          />
        </div>
        <div>
          <Label className="font-body text-xs text-muted-foreground">Note (optional)</Label>
          <Input
            className="font-body text-sm"
            placeholder="e.g. includes benefits"
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="font-body text-xs"
        onClick={addItem}
        disabled={!draft.label || !draft.amount}
      >
        <Plus className="w-3.5 h-3.5 mr-1" /> Add Line Item
      </Button>
    </div>
  );
}

export default function GivingManager({ selectedYear }) {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['fundSettings', selectedYear],
    queryFn: async () => {
      const query = { key: FUND_KEY };
      if (selectedYear) {
        const year = parseInt(selectedYear);
        const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(year + 1, 0, 0).toISOString().split('T')[0];
        // Filter annual funds that overlap with the selected fiscal year
        query.start_date = { $lte: endOfYear };
        query.end_date = { $gte: startOfYear };
      }
      return base44.entities.FundSettings.filter(query);
    },
  });

  const record = settings[0] || null;

  const { data: allocations = [], isLoading: allocLoading } = useQuery({
    queryKey: ['budgetAllocations', selectedYear],
    queryFn: async () => {
      // If we have an annual fund record for this year, filter allocations to that year
      if (record) {
        return base44.entities.BudgetAllocation.filter({ fund_year: selectedYear || new Date().getFullYear().toString() }, 'sort_order', 50);
      }
      return [];
    },
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['donations', selectedYear, record?.id],
    queryFn: async () => {
      if (!record) return [];
      const year = parseInt(selectedYear) || new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(year + 1, 0, 0).toISOString().split('T')[0];
      return base44.entities.Donation.filter({
        fund_id: record.id,
        donation_date: { $gte: startOfYear, $lte: endOfYear }
      });
    },
  });

  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [newRow, setNewRow] = useState({ name: '', percentage: '', color: PRESET_COLORS[0] });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (record) {
      setGoal(String(record.goal || ''));
      const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      setCurrent(String(totalDonated));
      setStartDate(record.start_date || '');
      setEndDate(record.end_date || '');
    } else {
      setGoal('');
      setCurrent('');
      setStartDate('');
      setEndDate('');
    }
  }, [record, donations]);

  const handleSave = async () => {
    setSaving(true);
    const data = { key: FUND_KEY, goal: parseFloat(goal), current: parseFloat(current), label: 'Annual Fund', start_date: startDate, end_date: endDate };
    if (record) {
      // Update existing record for this year
      await base44.entities.FundSettings.update(record.id, data);
    } else {
      // Create new annual fund record for this year
      await base44.entities.FundSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['fundSettings', selectedYear] });
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
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations', selectedYear] });
  };

  const handleDeleteAllocation = async (id) => {
    await base44.entities.BudgetAllocation.delete(id);
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations', selectedYear] });
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
      fund_year: selectedYear || new Date().getFullYear().toString(),
    });
    queryClient.invalidateQueries({ queryKey: ['budgetAllocations', selectedYear] });
    setNewRow({ name: '', percentage: '', color: PRESET_COLORS[allocations.length % PRESET_COLORS.length] });
    toast.success("Category added");
    setSaving(false);
  };

  const goalNum = parseFloat(goal) || 0;
  const currentNum = parseFloat(current) || 0;
  const pctRaised = goalNum > 0 ? Math.round((currentNum / goalNum) * 100) : 0;

  const now = new Date();
  const displayYear = parseInt(selectedYear) || now.getFullYear();
  const startOfYear = new Date(displayYear, 0, 1);
  const endOfYear = new Date(displayYear + 1, 0, 1);
  const isCurrentYear = displayYear === now.getFullYear();
  const pctOfYear = isCurrentYear ? Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100) : 0;

  const diff = pctRaised - pctOfYear;
  const isAhead = diff > 2;
  const isBehind = diff < -2;
  const targetAmount = Math.round((pctOfYear / 100) * goalNum);
  const absDiff = Math.abs(currentNum - targetAmount);

  const allocTotal = allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0);
  const allocValid = Math.abs(allocTotal - 100) < 0.01;

  // Fund form component (from FundsManager)
  const EMPTY_FUND = {
    name: '',
    slug: '',
    description: '',
    status: 'active',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
    itemization: [],
    sort_order: 0,
  };

  function toSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
  }

  // Fundraising funds data and mutations
  const { data: funds = [] } = useQuery({
    queryKey: ['adminFunds', selectedYear],
    queryFn: async () => {
      const query = { slug: { $ne: FUND_KEY } };
      if (selectedYear) {
        const year = parseInt(selectedYear);
        const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(year + 1, 0, 0).toISOString().split('T')[0];
        // Filter funds that overlap with the selected fiscal year
        query.start_date = { $lte: endOfYear };
        query.end_date = { $gte: startOfYear };
      }
      return base44.entities.FundSettings.filter(query);
    },
  });

  const [editingFundId, setEditingFundId] = useState(null);
  const [expandedFundId, setExpandedFundId] = useState(null);
  const [fundForm, setFundForm] = useState(EMPTY_FUND);

  const fundSaveMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id && id !== 'new'
        ? base44.entities.FundSettings.update(id, data)
        : base44.entities.FundSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFunds'] });
      setEditingFundId(null);
      toast.success('Fund saved');
    },
  });

  const fundDeleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FundSettings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFunds'] });
      toast.success('Fund deleted');
    },
  });

  const handleSaveFund = (id, data) => {
    fundSaveMutation.mutate({ id, data: { ...data, goal: (data.itemization || []).reduce((s, i) => s + parseFloat(i.amount || 0), 0) } });
  };

  const handleFundNameChange = (e) => {
    const name = e.target.value;
    setFundForm(f => ({ ...f, name }));
    if (!fundForm.slug || fundForm.slug === toSlug(fundForm.name)) {
      setFundForm(f => ({ ...f, slug: toSlug(name) }));
    }
  };

  return (
    <div className="space-y-12">
      {/* Annual Fund Settings */}
      <div>
        <div>
          <h3 className="font-heading text-xl text-primary mb-1">Annual Fund Settings</h3>
          <p className="font-body text-sm text-muted-foreground">Update the goal and contributions-to-date shown on the Giving page.</p>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5 mt-6">
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
              disabled
              className="font-body"
            />
            <p className="font-body text-xs text-muted-foreground">Auto-calculated from donations</p>
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Fiscal Year Start</Label>
            <Input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Fiscal Year End</Label>
            <Input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="font-body"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Live Preview</span>
            <span className="font-body text-xs text-muted-foreground">{isCurrentYear ? `${pctOfYear}% through` : ''} {displayYear}</span>
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

        {/* Budget Allocations */}
        <div className="border-t border-border/50 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-heading text-sm text-primary">Budget Allocations</p>
            {allocations.length === 0 && (
              <Button variant="outline" size="sm" className="font-body text-xs" onClick={handleSeedDefaults} disabled={seeding}>
                Load Defaults
              </Button>
            )}
          </div>

          {!allocValid && allocations.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-destructive text-xs font-body">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Total is {allocTotal.toFixed(1)}% — must equal 100%.
            </div>
          )}

          {/* Existing allocations */}
          <div className="space-y-2">
            {allocations.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-secondary/40 rounded border border-border/30">
                <input
                  type="color"
                  value={item.color?.startsWith('hsl') ? '#2a3f6e' : item.color || '#2a3f6e'}
                  onChange={(e) => handleUpdateAllocation(item.id, 'color', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-border flex-shrink-0"
                  title="Pick color"
                />
                <input
                  className="flex-1 font-body text-xs bg-transparent border-b border-border/30 focus:border-primary outline-none pb-0.5 min-w-0"
                  value={item.name}
                  onChange={(e) => handleUpdateAllocation(item.id, 'name', e.target.value)}
                />
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-12 font-body text-xs bg-transparent border-b border-border/30 focus:border-primary outline-none text-right pb-0.5"
                    value={item.percentage}
                    onChange={(e) => handleUpdateAllocation(item.id, 'percentage', e.target.value)}
                  />
                  <span className="font-body text-xs text-muted-foreground">%</span>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0 h-6 w-6" onClick={() => handleDeleteAllocation(item.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Total */}
          {allocations.length > 0 && (
            <div className={`flex justify-end font-body text-xs font-semibold ${allocValid ? 'text-green-600' : 'text-destructive'}`}>
              Total: {allocTotal.toFixed(1)}% {allocValid ? '✓' : '(must be 100%)'}
            </div>
          )}

          {/* Add new allocation */}
          <div className="pt-2 space-y-2 border-t border-border/30">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Add Category</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newRow.color?.startsWith('hsl') ? '#2a3f6e' : newRow.color || '#2a3f6e'}
                onChange={(e) => setNewRow(r => ({ ...r, color: e.target.value }))}
                className="w-6 h-6 rounded cursor-pointer border border-border flex-shrink-0"
              />
              <Input
                placeholder="Category"
                value={newRow.name}
                onChange={(e) => setNewRow(r => ({ ...r, name: e.target.value }))}
                className="font-body text-xs flex-1"
              />
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={newRow.percentage}
                  onChange={(e) => setNewRow(r => ({ ...r, percentage: e.target.value }))}
                  className="font-body text-xs w-14 text-right"
                />
                <span className="font-body text-xs text-muted-foreground">%</span>
              </div>
              <Button size="sm" className="font-body gap-1 flex-shrink-0 h-8" onClick={handleAddAllocation} disabled={saving || !newRow.name || !newRow.percentage}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="font-body gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        </div>
      </div>

      {/* Fundraising Funds */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-xl text-primary">Fundraising Funds</h3>
            <p className="font-body text-sm text-muted-foreground mt-0.5">Manage separate giving funds (campaigns, missions, etc.) and their itemization breakdown.</p>
          </div>
          {editingFundId !== 'new' && (
            <Button size="sm" className="font-body text-xs bg-primary" onClick={() => { setEditingFundId('new'); setFundForm(EMPTY_FUND); }}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fund
            </Button>
          )}
        </div>

        {editingFundId === 'new' && (
          <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Fund Name *</Label>
                <Input className="font-body text-sm" value={fundForm.name} onChange={handleFundNameChange} placeholder="Building Campaign" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Slug (used in system)</Label>
                <Input
                  className="font-body text-sm font-mono"
                  value={fundForm.slug}
                  onChange={e => setFundForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                  placeholder="building_campaign"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Description</Label>
                <Input className="font-body text-sm" value={fundForm.description} onChange={e => setFundForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description shown to donors" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Status</Label>
                <select value={fundForm.status || 'active'} onChange={e => setFundForm(f => ({ ...f, status: e.target.value }))} className="w-full font-body text-sm px-3 py-1.5 rounded border border-input bg-background">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Fiscal Year Start</Label>
                <Input type="date" value={fundForm.start_date} onChange={e => setFundForm(f => ({ ...f, start_date: e.target.value }))} className="font-body text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">Fiscal Year End</Label>
                <Input type="date" value={fundForm.end_date} onChange={e => setFundForm(f => ({ ...f, end_date: e.target.value }))} className="font-body text-sm" />
              </div>
            </div>

            <ItemizationEditor 
              items={fundForm.itemization || []} 
              onChange={v => setFundForm(f => ({ ...f, itemization: v }))} 
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" className="font-body text-xs" onClick={() => setEditingFundId(null)}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </Button>
              <Button size="sm" className="font-body text-xs bg-primary" onClick={() => handleSaveFund('new', fundForm)} disabled={fundSaveMutation.isPending || !fundForm.name || !fundForm.slug}>
                <Check className="w-3.5 h-3.5 mr-1" /> Save Fund
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {funds.map(fund => (
            <div key={fund.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              {editingFundId === fund.id ? (
                <div className="p-4 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-body text-xs text-muted-foreground">Fund Name *</Label>
                      <Input className="font-body text-sm" value={fundForm.name} onChange={e => setFundForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-xs text-muted-foreground">Slug</Label>
                      <Input className="font-body text-sm font-mono" value={fundForm.slug} onChange={e => setFundForm(f => ({ ...f, slug: toSlug(e.target.value) }))} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="font-body text-xs text-muted-foreground">Description</Label>
                      <Input className="font-body text-sm" value={fundForm.description} onChange={e => setFundForm(f => ({ ...f, description: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                      <Label className="font-body text-xs text-muted-foreground">Fiscal Year Start</Label>
                      <Input type="date" value={fundForm.start_date} onChange={e => setFundForm(f => ({ ...f, start_date: e.target.value }))} className="font-body text-sm" />
                      </div>
                      <div className="space-y-1.5">
                      <Label className="font-body text-xs text-muted-foreground">Fiscal Year End</Label>
                      <Input type="date" value={fundForm.end_date} onChange={e => setFundForm(f => ({ ...f, end_date: e.target.value }))} className="font-body text-sm" />
                      </div>
                      </div>

                      <ItemizationEditor 
                      items={fundForm.itemization || []} 
                      onChange={v => setFundForm(f => ({ ...f, itemization: v }))} 
                      />

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="font-body text-xs" onClick={() => setEditingFundId(null)}>
                      <X className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" className="font-body text-xs bg-primary" onClick={() => handleSaveFund(fund.id, fundForm)} disabled={fundSaveMutation.isPending}>
                      <Check className="w-3.5 h-3.5 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                               <span className="font-heading text-base text-primary">{fund.name}</span>
                               <span className="font-body text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{fund.slug}</span>
                               <select 
                                 value={fund.status || 'active'} 
                                 onChange={(e) => fundSaveMutation.mutate({ id: fund.id, data: { ...fund, status: e.target.value } })}
                                 className={`font-body text-xs px-2 py-1 rounded border-0 cursor-pointer ${fund.status === 'active' ? 'bg-green-100 text-green-700' : fund.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                               >
                                 <option value="pending">Pending</option>
                                 <option value="active">Active</option>
                                 <option value="closed">Closed</option>
                               </select>
                             </div>
                      {fund.description && <p className="font-body text-xs text-muted-foreground mt-0.5">{fund.description}</p>}
                      {fund.itemization?.length > 0 && <p className="font-body text-xs text-accent mt-0.5">Goal: ${fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toLocaleString()}</p>}
                    </div>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      {fund.itemization?.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={() => setExpandedFundId(expandedFundId === fund.id ? null : fund.id)}>
                          {expandedFundId === fund.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => { setEditingFundId(fund.id); setFundForm(fund); }}>
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => fundDeleteMutation.mutate(fund.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {expandedFundId === fund.id && fund.itemization?.length > 0 && (
                    <div className="border-t border-border/40 px-5 py-4 space-y-2 bg-secondary/20">
                      <p className="font-body text-xs tracking-[0.18em] uppercase text-accent mb-2">Itemization</p>
                      {fund.itemization.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between font-body text-sm">
                          <span className="text-foreground">{item.label}{item.description ? <span className="text-muted-foreground text-xs"> — {item.description}</span> : ''}</span>
                          <span className="text-primary font-medium">${parseFloat(item.amount).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-border/40 pt-2 flex justify-between font-body text-sm font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {funds.length === 0 && editingFundId !== 'new' && (
            <p className="font-body text-muted-foreground text-center py-10">No funds yet. Add your first fund above.</p>
          )}
        </div>
      </div>
    </div>
  );
}