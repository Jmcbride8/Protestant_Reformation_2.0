import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FUND = {
  name: '',
  slug: '',
  description: '',
  is_active: true,
  itemization: [],
  sort_order: 0,
};

const EMPTY_ITEM = { label: '', amount: '', description: '' };

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

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

function FundForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initial || EMPTY_FUND);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNameChange = (e) => {
    const name = e.target.value;
    set('name', name);
    // Auto-fill slug only if it hasn't been manually changed
    if (!form.slug || form.slug === toSlug(form.name)) {
      set('slug', toSlug(name));
    }
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Fund Name *</Label>
          <Input className="font-body text-sm" value={form.name} onChange={handleNameChange} placeholder="Church Annual Fund" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Slug (used in system)</Label>
          <Input
            className="font-body text-sm font-mono"
            value={form.slug}
            onChange={e => set('slug', toSlug(e.target.value))}
            placeholder="church_annual_fund"
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Description</Label>
          <Input className="font-body text-sm" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description shown to donors" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs text-muted-foreground">Status</Label>
          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" id="fund_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-primary" />
            <label htmlFor="fund_active" className="font-body text-sm text-foreground cursor-pointer">Active (accepting donations)</label>
          </div>
        </div>
      </div>

      <ItemizationEditor items={form.itemization || []} onChange={v => set('itemization', v)} />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" className="font-body text-xs" onClick={onCancel}>
          <X className="w-3.5 h-3.5 mr-1" /> Cancel
        </Button>
        <Button size="sm" className="font-body text-xs bg-primary" onClick={() => onSave({ ...form, goal: (form.itemization || []).reduce((s, i) => s + parseFloat(i.amount || 0), 0) })} disabled={isSaving || !form.name || !form.slug}>
          <Check className="w-3.5 h-3.5 mr-1" /> Save Fund
        </Button>
      </div>
    </div>
  );
}

export default function FundsManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null); // null = none, 'new' = new form
  const [expandedId, setExpandedId] = useState(null);

  const { data: funds = [] } = useQuery({
    queryKey: ['adminFunds'],
    queryFn: () => base44.entities.FundSettings.list('sort_order', 50),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id && id !== 'new'
        ? base44.entities.FundSettings.update(id, data)
        : base44.entities.FundSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFunds'] });
      setEditingId(null);
      toast.success('Fund saved');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FundSettings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFunds'] });
      toast.success('Fund deleted');
    },
  });

  const handleSave = (id, data) => {
    saveMutation.mutate({ id, data });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl text-primary">Fundraising Funds</h3>
          <p className="font-body text-sm text-muted-foreground mt-0.5">Manage giving funds and their itemization breakdown.</p>
        </div>
        {editingId !== 'new' && (
          <Button size="sm" className="font-body text-xs bg-primary" onClick={() => setEditingId('new')}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Fund
          </Button>
        )}
      </div>

      {editingId === 'new' && (
        <FundForm
          onSave={(data) => handleSave('new', data)}
          onCancel={() => setEditingId(null)}
          isSaving={saveMutation.isPending}
        />
      )}

      <div className="space-y-3">
        {funds.map(fund => (
          <div key={fund.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
            {editingId === fund.id ? (
              <div className="p-4">
                <FundForm
                  initial={fund}
                  onSave={(data) => handleSave(fund.id, data)}
                  onCancel={() => setEditingId(null)}
                  isSaving={saveMutation.isPending}
                />
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
                      <Button variant="ghost" size="icon" onClick={() => setExpandedId(expandedId === fund.id ? null : fund.id)}>
                        {expandedId === fund.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(fund.id)}>
                      <Pencil className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(fund.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {expandedId === fund.id && fund.itemization?.length > 0 && (
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

        {funds.length === 0 && editingId !== 'new' && (
          <p className="font-body text-muted-foreground text-center py-10">No funds yet. Add your first fund above.</p>
        )}
      </div>
    </div>
  );
}