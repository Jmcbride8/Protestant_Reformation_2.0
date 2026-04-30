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

  const addItem = () => {
    if (!draft.label || !draft.amount) return;
    onChange([...items, { ...draft, amount: parseFloat(draft.amount) }]);
    setDraft(EMPTY_ITEM);
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <p className="font-body text-xs tracking-[0.18em] uppercase text-accent">Itemization Breakdown</p>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-2 text-sm font-body">
          <span className="flex-1 text-foreground">{item.label}</span>
          <span className="text-muted-foreground">${parseFloat(item.amount).toLocaleString()}</span>
          {item.description && <span className="text-xs text-muted-foreground italic">— {item.description}</span>}
          <button onClick={() => removeItem(idx)} className="ml-2 text-destructive/70 hover:text-destructive">
            <X className="w-3.5 h-3.5" />
          </button>
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

  const [current, setCurrent] = useState('');
  const [itemization, setItemization] = useState([]);
  const [saving, setSaving] = useState(false);
  const [newRow, setNewRow] = useState({ name: '', percentage: '', color: PRESET_COLORS[0] });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (record) {
      setCurrent(String(record.current));
      setItemization(record.itemization || []);
    } else {
      setCurrent('187000');
      setItemization([]);
    }
  }, [record]);

  const goalNum = itemization.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    const data = { key: FUND_KEY, goal: goalNum, current: parseFloat(current), label: 'Annual Fund', itemization };
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

  // Fund form component (from FundsManager)
  const EMPTY_FUND = {
    name: '',
    slug: '',
    description: '',
    is_active: true,
    itemization: [],
    sort_order: 0,
  };

  function toSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
  }

  // Fundraising funds data and mutations
  const { data: funds = [] } = useQuery({
    queryKey: ['adminFunds'],
    queryFn: () => base44.entities.FundSettings.filter({ slug: { $ne: FUND_KEY } }),
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
            <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-base shadow-sm items-center text-foreground font-semibold">
              ${goalNum.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Calculated from itemization below</p>
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

        {/* Annual Fund Itemization */}
        <div className="border-t border-border/50 pt-5">
          <ItemizationEditor 
            items={itemization} 
            onChange={setItemization} 
          />
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
                <div className="flex items-center gap-3 mt-2">
                  <input type="checkbox" id="fund_active" checked={fundForm.is_active} onChange={e => setFundForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                  <label htmlFor="fund_active" className="font-body text-sm text-foreground cursor-pointer">Active (accepting donations)</label>
                </div>
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
                  </div>
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
                        {fund.is_active
                          ? <Badge className="bg-green-100 text-green-700 font-body text-xs">Active</Badge>
                          : <Badge variant="secondary" className="font-body text-xs">Inactive</Badge>}
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