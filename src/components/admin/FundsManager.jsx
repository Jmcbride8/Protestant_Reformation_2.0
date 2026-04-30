import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

const EMPTY_FUND = {
  name: '',
  slug: '',
  description: '',
  goal: 0,
  is_active: true,
  itemization: []
};

export default function FundsManager() {
  const queryClient = useQueryClient();
  const [editingFundId, setEditingFundId] = useState(null);
  const [expandedFundId, setExpandedFundId] = useState(null);
  const [fundForm, setFundForm] = useState(EMPTY_FUND);

  const { data: funds = [] } = useQuery({
    queryKey: ['funds'],
    queryFn: () => base44.entities.FundSettings.filter({ slug: { $ne: 'annual_fund' } }, '-sort_order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FundSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      setEditingFundId(null);
      setFundForm(EMPTY_FUND);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FundSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      setEditingFundId(null);
      setFundForm(EMPTY_FUND);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FundSettings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
    }
  });

  const handleSave = (id) => {
    if (!fundForm.name || !fundForm.slug) return;
    if (id === 'new') {
      createMutation.mutate(fundForm);
    } else {
      updateMutation.mutate({ id, data: fundForm });
    }
  };

  const startEdit = (fund) => {
    setEditingFundId(fund.id);
    setFundForm(fund);
  };

  const cancelEdit = () => {
    setEditingFundId(null);
    setFundForm(EMPTY_FUND);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg text-primary">Fundraising Funds</h3>
          <p className="font-body text-sm text-muted-foreground mt-1">Create and manage separate giving campaigns.</p>
        </div>
        {editingFundId !== 'new' && (
          <Button size="sm" onClick={() => { setEditingFundId('new'); setFundForm(EMPTY_FUND); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Fund
          </Button>
        )}
      </div>

      {/* New Fund Form */}
      {editingFundId === 'new' && (
        <FundForm
          fund={fundForm}
          onChange={setFundForm}
          onSave={() => handleSave('new')}
          onCancel={cancelEdit}
          isSaving={createMutation.isPending}
        />
      )}

      {/* Funds List */}
      <div className="space-y-3">
        {funds.length === 0 && editingFundId !== 'new' && (
          <p className="font-body text-muted-foreground text-center py-8 bg-secondary/20 rounded-lg">
            No funds yet. Add your first fundraising fund above.
          </p>
        )}

        {funds.map((fund) => (
          <div key={fund.id} className="bg-card border border-border/50 rounded-lg overflow-hidden">
            {editingFundId === fund.id ? (
              <FundForm
                fund={fundForm}
                onChange={setFundForm}
                onSave={() => handleSave(fund.id)}
                onCancel={cancelEdit}
                isSaving={updateMutation.isPending}
              />
            ) : (
              <FundDisplay
                fund={fund}
                expanded={expandedFundId === fund.id}
                onToggleExpand={() => setExpandedFundId(expandedFundId === fund.id ? null : fund.id)}
                onEdit={() => startEdit(fund)}
                onDelete={() => deleteMutation.mutate(fund.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FundForm({ fund, onChange, onSave, onCancel, isSaving }) {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body text-sm">Fund Name *</Label>
          <Input
            value={fund.name}
            onChange={(e) => onChange({ ...fund, name: e.target.value })}
            placeholder="Building Campaign"
            className="font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Slug *</Label>
          <Input
            value={fund.slug}
            onChange={(e) => onChange({ ...fund, slug: toSlug(e.target.value) })}
            placeholder="building_campaign"
            className="font-body font-mono text-xs"
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label className="font-body text-sm">Description</Label>
          <Input
            value={fund.description || ''}
            onChange={(e) => onChange({ ...fund, description: e.target.value })}
            placeholder="What this fund is for"
            className="font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Status</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id={`fund_active_${fund.id || 'new'}`}
              checked={fund.is_active}
              onChange={(e) => onChange({ ...fund, is_active: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor={`fund_active_${fund.id || 'new'}`} className="font-body text-sm cursor-pointer">
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving || !fund.name || !fund.slug}>
          <Check className="w-4 h-4 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

function FundDisplay({ fund, expanded, onToggleExpand, onEdit, onDelete }) {
  return (
    <>
      <div className="flex items-center justify-between p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-heading text-base text-primary">{fund.name}</h4>
            <span className="font-body text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {fund.slug}
            </span>
            <Badge className={fund.is_active ? 'bg-green-100 text-green-700' : 'bg-secondary text-secondary-foreground'}>
              {fund.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {fund.description && <p className="font-body text-xs text-muted-foreground">{fund.description}</p>}
          {fund.itemization?.length > 0 && (
            <p className="font-body text-xs text-accent mt-1">
              Goal: ${fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          {fund.itemization?.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onToggleExpand}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="w-4 h-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Itemization Breakdown */}
      {expanded && fund.itemization?.length > 0 && (
        <div className="border-t border-border/30 px-5 py-4 space-y-2 bg-secondary/20">
          <p className="font-body text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Itemization</p>
          {fund.itemization.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <span className="font-body text-sm text-foreground">{item.label}</span>
                {item.description && <span className="font-body text-xs text-muted-foreground ml-1">— {item.description}</span>}
              </div>
              <span className="font-body text-sm font-semibold text-primary ml-3">${parseFloat(item.amount).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border/30 pt-2 flex justify-between font-body text-sm font-semibold">
            <span>Total</span>
            <span className="text-primary">${fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toLocaleString()}</span>
          </div>
        </div>
      )}
    </>
  );
}