import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DonationMonthlyChart({ donations }) {
  if (!donations || donations.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-secondary/30 rounded-lg border border-dashed border-border">
        <p className="font-body text-muted-foreground">No donation data to display</p>
      </div>
    );
  }

  // Aggregate donations by month
  const monthlyData = {};
  donations.forEach(d => {
    const date = new Date(d.created_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { monthKey, monthLabel, total: 0 };
    }
    monthlyData[monthKey].total += d.amount || 0;
  });

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-12); // Show last 12 months

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-body text-sm text-foreground">{payload[0].payload.monthLabel}</p>
          <p className="font-heading text-lg text-primary">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="font-heading text-lg text-primary mb-4">Giving by Month</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="monthLabel" 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}