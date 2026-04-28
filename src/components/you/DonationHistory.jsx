import React from 'react';
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
};

export default function DonationHistory({ donations }) {
  const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-2xl text-primary">Giving History</h2>
        {donations.length > 0 && (
          <span className="ml-auto font-body text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">${total.toLocaleString()}</span>
          </span>
        )}
      </div>

      {donations.length > 1 && <GivingChart donations={donations} />}

      {donations.length === 0 ? (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-8 text-center">
          <DollarSign className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No giving records linked to your account yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">
          {donations.sort((a, b) => new Date(b.donation_date || b.created_date) - new Date(a.donation_date || a.created_date)).map(d => (
            <div key={d.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{fundLabels[d.fund] || d.fund}</p>
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