import React from 'react';

export default function DonationKPIs({ donations }) {
  if (!donations || donations.length === 0) {
    return null;
  }

  const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const count = donations.length;
  const average = count > 0 ? Math.round(total / count) : 0;

  const kpis = [
    { label: 'Total Donations', value: `$${total.toLocaleString()}` },
    { label: 'Donation Count', value: count },
    { label: 'Average Donation', value: `$${average.toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-card border border-border/50 rounded-lg p-4">
          <p className="font-body text-xs text-muted-foreground mb-1">{kpi.label}</p>
          <p className="font-heading text-2xl text-primary">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
}