import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, Save } from 'lucide-react';

const FUND_KEY = 'annual_fund';

export default function GivingManager() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['fundSettings'],
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

  return (
    <div className="space-y-6">
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
    </div>
  );
}