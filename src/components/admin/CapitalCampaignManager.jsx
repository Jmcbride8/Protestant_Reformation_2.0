import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from 'lucide-react';

const FUND_KEY = 'capital_campaign';

export default function CapitalCampaignManager() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['fundSettings', FUND_KEY],
    queryFn: () => base44.entities.FundSettings.filter({ key: FUND_KEY }),
  });

  const record = settings[0] || null;

  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setGoal(String(record.goal));
      setCurrent(String(record.current));
    } else {
      setGoal('30000');
      setCurrent('18750');
    }
  }, [record]);

  const handleSave = async () => {
    setSaving(true);
    const data = { key: FUND_KEY, goal: parseFloat(goal), current: parseFloat(current), label: 'Building Renovation Fund' };
    if (record) {
      await base44.entities.FundSettings.update(record.id, data);
    } else {
      await base44.entities.FundSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['fundSettings'] });
    queryClient.invalidateQueries({ queryKey: ['capitalCampaignSettings'] });
    toast.success("Capital campaign settings saved");
    setSaving(false);
  };

  const goalNum = parseFloat(goal) || 0;
  const currentNum = parseFloat(current) || 0;
  const pctRaised = goalNum > 0 ? Math.round((currentNum / goalNum) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl text-primary mb-1">Capital Campaign Settings</h3>
        <p className="font-body text-sm text-muted-foreground">Update the goal and amount raised for the Building Renovation Fund.</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="font-body text-sm">Campaign Goal ($)</Label>
            <Input
              type="number"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="30000"
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Amount Raised to Date ($)</Label>
            <Input
              type="number"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="18750"
              className="font-body"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Live Preview</span>
            <span className="font-body text-xs text-muted-foreground">{pctRaised}% raised</span>
          </div>
          <div className="relative h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-accent"
              style={{ width: `${Math.min(pctRaised, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-sm font-semibold text-primary">
              ${currentNum.toLocaleString()} <span className="font-body text-xs text-muted-foreground font-normal">of ${goalNum.toLocaleString()}</span>
            </span>
            <span className="font-body text-xs text-muted-foreground">{100 - pctRaised}% remaining</span>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="font-body gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}