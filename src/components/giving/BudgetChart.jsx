import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
    </div>
  );
}