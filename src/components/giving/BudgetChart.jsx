import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const budgetData = [
  { name: 'Ministry & Worship', value: 30, color: 'hsl(224, 52%, 23%)' },
  { name: 'Community Programs', value: 20, color: 'hsl(38, 45%, 60%)' },
  { name: 'Staff & Operations', value: 25, color: 'hsl(224, 30%, 50%)' },
  { name: 'Missions & Outreach', value: 15, color: 'hsl(38, 60%, 75%)' },
  { name: 'Building & Maintenance', value: 10, color: 'hsl(224, 20%, 70%)' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-heading text-sm text-primary">{payload[0].name}</p>
        <p className="font-body text-lg font-semibold text-primary">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function BudgetChart() {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={budgetData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {budgetData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {budgetData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-body text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}