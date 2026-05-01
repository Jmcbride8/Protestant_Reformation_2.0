import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, Save, Trash2, Plus, AlertCircle, Pencil, X, ChevronDown, ChevronUp, Check } from 'lucide-react';

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

  // All funds data
  const { data: funds = [] } = useQuery({
    queryKey: ['allFunds', selectedYear],
    queryFn: async () => {
      if (selectedYear) {
        const year = parseInt(selectedYear);
        const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(year + 1, 0, 0).toISOString().split('T')[0];
        // Filter funds that overlap with the selected fiscal year
        return base44.entities.FundSettings.filter({
          start_date: { $lte: endOfYear },
          end_date: { $gte: startOfYear }
        });
      }
      return base44.entities.FundSettings.list();
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

  const handleSaveFund = async (id, data) => {
    // If marking this as annual budget, unset all others
    if (data.is_annual_budget) {
      const otherFunds = funds.filter(f => f.id !== (id === 'new' ? null : id) && f.is_annual_budget);
      for (const fund of otherFunds) {
        await base44.entities.FundSettings.update(fund.id, { is_annual_budget: false });
      }
    }
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
    <div className="space-y-8">
      {/* All Funds */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-xl text-primary">Funds</h3>
            <p className="font-body text-sm text-muted-foreground mt-0.5">Manage all giving funds (annual budget, campaigns, missions, etc.) and their itemization breakdown.</p>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={fundForm.is_annual_budget || false} onChange={e => setFundForm(f => ({ ...f, is_annual_budget: e.target.checked }))} className="w-4 h-4 rounded border border-input" />
                  <span className="font-body text-xs text-muted-foreground">Mark as Annual Budget</span>
                </label>
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
                  <div className="px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                                 <span className="font-heading text-base text-primary">{fund.name}</span>
                                 <span className="font-body text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{fund.slug}</span>
                                 {fund.is_annual_budget && <span className="font-body text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground font-semibold">Annual Budget</span>}
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

                      {fund.itemization?.length > 0 && (() => {
                      const goal = fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
                      const raised = 0; // Donations would be fetched per fund if needed
                      const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-body text-xs text-muted-foreground">Progress</span>
                            <span className="font-body text-xs font-semibold text-primary">${raised.toLocaleString()} / ${goal.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent transition-all duration-500" 
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <div className="text-right">
                            <span className="font-body text-xs text-muted-foreground">{pct}% raised</span>
                          </div>
                        </div>
                      );
                      })()}
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