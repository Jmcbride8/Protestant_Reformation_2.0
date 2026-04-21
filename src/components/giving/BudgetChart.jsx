import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const FALLBACK = [
  { name: 'Ministry & Worship', percentage: 30, color: 'hsl(224, 52%, 23%)' },
  { name: 'Community Programs', percentage: 20, color: 'hsl(38, 45%, 60%)' },
  { name: 'Staff & Operations', percentage: 25, color: 'hsl(224, 30%, 50%)' },
  { name: 'Missions & Outreach', percentage: 15, color: 'hsl(38, 60%, 75%)' },
  { name: 'Building & Maintenance', percentage: 10, color: 'hsl(224, 20%, 70%)' },
];

const CustomTooltip = ({ active, payload, totalBudget }) => {
  if (active && payload && payload.length) {
    const dollars = totalBudget ? Math.round((payload[0].value / 100) * totalBudget) : null;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-heading text-sm text-primary">{payload[0].name}</p>
        <p className="font-body text-lg font-semibold text-primary">{payload[0].value}%</p>
        {dollars !== null && (
          <p className="font-body text-sm text-muted-foreground">${dollars.toLocaleString()}</p>
        )}
      </div>
    );
  }
  return null;
};

function AnnualFundIndicator({ current, goal }) {
  const pctRaised = Math.round((current / goal) * 100);

  // How far through the calendar year are we?
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const pctOfYear = Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100);

  const diff = pctRaised - pctOfYear;
  const isAhead = diff > 2;
  const isBehind = diff < -2;

  const targetAmount = Math.round((pctOfYear / 100) * goal);
  const absDiff = Math.abs(current - targetAmount);

  return (
    <div className="mt-6 p-4 rounded-xl border border-border bg-secondary/30">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Annual Fund Progress</span>
        <span className="font-body text-xs text-muted-foreground">{pctOfYear}% through {now.getFullYear()}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-border rounded-full overflow-hidden mb-3">
        {/* Year target marker */}
        <div className="absolute top-0 h-full w-0.5 bg-muted-foreground/50 z-10" style={{ left: `${pctOfYear}%` }} />
        {/* Raised amount */}
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pctRaised, 100)}%`, backgroundColor: isAhead ? 'hsl(142, 60%, 40%)' : isBehind ? 'hsl(0, 72%, 55%)' : 'hsl(38, 45%, 60%)' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isAhead ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : isBehind ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <Minus className="w-4 h-4 text-accent" />
          )}
          <span className={`font-body text-sm font-semibold ${isAhead ? 'text-green-600' : isBehind ? 'text-red-500' : 'text-accent'}`}>
            {pctRaised}% raised
          </span>
          <span className="font-body text-xs text-muted-foreground">
            (${current.toLocaleString()} of ${goal.toLocaleString()})
          </span>
        </div>
        <span className={`font-body text-xs font-medium ${isAhead ? 'text-green-600' : isBehind ? 'text-red-500' : 'text-accent'}`}>
          {isAhead ? `$${absDiff.toLocaleString()} ahead` : isBehind ? `$${absDiff.toLocaleString()} behind` : 'On track'}
        </span>
      </div>
    </div>
  );
}

export default function BudgetChart({ totalBudget }) {
  const { data: allocations = [] } = useQuery({
    queryKey: ['budgetAllocations'],
    queryFn: () => base44.entities.BudgetAllocation.list('sort_order', 50),
  });

  const data = allocations.length > 0
    ? allocations.map(a => ({ name: a.name, value: Number(a.percentage), color: a.color || 'hsl(224, 52%, 23%)' }))
    : FALLBACK.map(a => ({ name: a.name, value: a.percentage, color: a.color }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip totalBudget={totalBudget} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 mt-6">
        {data.map((item, index) => {
          const dollars = totalBudget ? Math.round((item.value / 100) * totalBudget) : null;
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-body text-xs text-muted-foreground truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {dollars !== null && (
                  <span className="font-body text-xs font-medium text-primary">${dollars.toLocaleString()}</span>
                )}
                <span className="font-body text-xs text-muted-foreground">({item.value}%)</span>
              </div>
            </div>
          );
        })}
      </div>
      {totalBudget && <AnnualFundIndicator current={187000} goal={totalBudget} />}
    </div>
  );
}