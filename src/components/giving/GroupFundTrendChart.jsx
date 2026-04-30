import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, eachMonthOfInterval, endOfMonth, parseISO } from 'date-fns';

export default function GroupFundTrendChart({ transactions }) {
  // Build monthly data
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">No transaction history to display.</p>
      </div>
    );
  }

  // Get date range
  const dates = transactions.map(t => parseISO(t.transaction_date || t.created_date.split('T')[0]));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Generate all months in range
  const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) });

  // Aggregate by month
  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthTransactions = transactions.filter(t => {
      const date = parseISO(t.transaction_date || t.created_date.split('T')[0]);
      return date >= monthStart && date <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'given' || t.type === 'received')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      month: format(month, 'MMM'),
      income,
      expenses,
      net: income - expenses,
    };
  });

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h3 className="font-heading text-xl text-primary mb-6">Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Bar
            dataKey="income"
            fill="hsl(var(--muted))"
            name="Income"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill="hsl(var(--destructive))"
            name="Expenses"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}