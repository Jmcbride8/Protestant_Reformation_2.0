import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

const fundColors = {
  general: 'hsl(var(--primary))',
  building_campaign: 'hsl(var(--accent))',
  missions: 'hsl(var(--chart-3))',
  youth: 'hsl(var(--chart-4))',
  community_meals: 'hsl(var(--chart-5))',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-lg">
        <p className="font-body text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-heading text-lg text-primary">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function GivingChart({ donations }) {
  if (!donations || donations.length === 0) return null;

  // Group by month
  const monthMap = {};
  donations.forEach(d => {
    if (!d.created_date) return;
    const key = format(new Date(d.donation_date || d.created_date), 'MMM yyyy');
    monthMap[key] = (monthMap[key] || 0) + (d.amount || 0);
  });

  const data = Object.entries(monthMap)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([month, total]) => ({ month, total }));

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 mb-4">
      <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Giving Over Time</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="hsl(var(--primary))" opacity={0.75 + (i / data.length) * 0.25} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}