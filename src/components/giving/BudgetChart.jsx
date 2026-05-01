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

export default function BudgetChart({ fund, totalRaised }) {
  // If fund has itemization, use it; otherwise use fallback
  const itemization = fund?.itemization || [];
  const totalBudget = itemization.reduce((sum, item) => sum + (item.amount || 0), 0) || 250000;

  const data = itemization.length > 0
    ? itemization.map((item, idx) => {
        const percentage = totalBudget > 0 ? Math.round((item.amount / totalBudget) * 100) : 0;
        return {
          name: item.label,
          value: percentage,
          amount: item.amount,
          color: [
            'hsl(224, 52%, 23%)',
            'hsl(38, 45%, 60%)',
            'hsl(224, 30%, 50%)',
            'hsl(38, 60%, 75%)',
            'hsl(224, 20%, 70%)',
          ][idx % 5],
        };
      })
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

    </div>
  );
}