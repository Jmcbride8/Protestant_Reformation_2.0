import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function FundingProgress({ label, current, goal, color }) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const pctOfYear = Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100);

  const diff = percentage - pctOfYear;
  const isAhead = diff > 2;
  const isBehind = diff < -2;
  const targetAmount = Math.round((pctOfYear / 100) * goal);
  const absDiff = Math.abs(current - targetAmount);
  const statusColor = isAhead ? 'hsl(142, 60%, 40%)' : isBehind ? 'hsl(0, 72%, 55%)' : 'hsl(38, 45%, 60%)';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-body text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl text-primary">
            ${current.toLocaleString()} <span className="text-base text-muted-foreground font-body">of ${goal.toLocaleString()}</span>
          </p>
        </div>
        <span className="font-heading text-3xl text-primary">{percentage}%</span>
      </div>

      {/* Progress bar with year-target marker */}
      <div className="relative w-full bg-secondary rounded-full h-3 overflow-hidden">
        <div className="absolute top-0 h-full w-0.5 bg-muted-foreground/40 z-10" style={{ left: `${pctOfYear}%` }} />
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color || statusColor }}
        />
      </div>

      {/* Ahead / behind indicator */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {isAhead ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : isBehind ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5 text-accent" />}
          <span className={`font-body text-xs font-medium ${isAhead ? 'text-green-600' : isBehind ? 'text-red-500' : 'text-accent'}`}>
            {isAhead ? `$${absDiff.toLocaleString()} ahead of pace` : isBehind ? `$${absDiff.toLocaleString()} behind pace` : 'On pace'}
          </span>
        </div>
        <span className="font-body text-xs text-muted-foreground">{pctOfYear}% through {now.getFullYear()}</span>
      </div>
    </div>
  );
}