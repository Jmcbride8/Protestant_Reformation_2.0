import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import GivingChart from './GivingChart';

const fundLabels = {
  general: 'General Fund',
  building_campaign: 'Building Campaign',
  missions: 'Missions',
  youth: 'Youth Ministry',
  community_meals: 'Community Meals',
  people: 'Gift to Individual',
};

// Giving type buckets
const GIVING_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'budget', label: 'Annual Budget' },
  { key: 'people', label: 'People' },
  { key: 'fund', label: 'Fund' },
];

const BUDGET_FUNDS = ['general', 'youth', 'community_meals'];
const FUND_FUNDS = ['building_campaign', 'missions'];

function getGivingType(donation) {
  if (donation.fund === 'people') return 'people';
  if (BUDGET_FUNDS.includes(donation.fund)) return 'budget';
  if (FUND_FUNDS.includes(donation.fund)) return 'fund';
  return 'budget';
}

export default function DonationHistory({ donations }) {
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const years = [...new Set(
    donations.map(d => {
      const date = new Date(d.donation_date || d.created_date);
      return date.getFullYear();
    })
  )].sort((a, b) => b - a);

  const filtered = donations.filter(d => {
    const date = new Date(d.donation_date || d.created_date);
    const yearOk = yearFilter === 'all' || date.getFullYear() === parseInt(yearFilter);
    const typeOk = typeFilter === 'all' || getGivingType(d) === typeFilter;
    return yearOk && typeOk;
  });

  const total = filtered.reduce((sum, d) => sum + (d.amount || 0), 0);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.donation_date || b.created_date) - new Date(a.donation_date || a.created_date)
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-2xl text-primary">Giving History</h2>
        {filtered.length > 0 && (
          <span className="ml-auto font-body text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">${total.toLocaleString()}</span>
          </span>
        )}
      </div>

      {/* Filters */}
      {donations.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Year filter */}
          <div className="flex bg-secondary/50 rounded-lg p-1 gap-1">
            <button
              onClick={() => setYearFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-body font-medium transition-colors ${yearFilter === 'all' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All Years
            </button>
            {years.map(y => (
              <button
                key={y}
                onClick={() => setYearFilter(String(y))}
                className={`px-3 py-1 rounded-md text-xs font-body font-medium transition-colors ${yearFilter === String(y) ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Giving type filter */}
          <div className="flex bg-secondary/50 rounded-lg p-1 gap-1">
            {GIVING_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-body font-medium transition-colors ${typeFilter === key ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length > 1 && <GivingChart donations={filtered} />}

      {donations.length === 0 ? (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-8 text-center">
          <DollarSign className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No giving records linked to your account yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">No gifts match the selected filters.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">
          {sorted.map(d => (
            <div key={d.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  {fundLabels[d.fund] || d.fund}
                  {d.fund === 'people' && d.recipient_name && (
                    <span className="ml-1 text-muted-foreground font-normal">· {d.recipient_name}</span>
                  )}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {format(new Date(d.donation_date || d.created_date), 'MMMM d, yyyy')}
                  {d.is_recurring && <span className="ml-2 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[10px]">Recurring</span>}
                </p>
              </div>
              <p className="font-heading text-lg text-primary">${d.amount?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}