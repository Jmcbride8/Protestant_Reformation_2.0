import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import BudgetChart from './BudgetChart';
import FundingProgress from './FundingProgress';
import DonationForm from './DonationForm';

export default function AnnualBudgetSection({ fund, isEnabled }) {
  const [donationSubmitted, setDonationSubmitted] = useState(false);

  // Load donations for this fund
  const { data: donations = [] } = useQuery({
    queryKey: ['fundDonations', fund.id],
    queryFn: () => base44.entities.Donation.filter({ fund_id: fund.id }),
  });

  // Calculate total raised
  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const goal = fund.itemization?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  return (
    <>
      {isEnabled('giving_annual_budget') && (
        <section className="py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Full Transparency</p>
                <h2 className="font-heading text-4xl text-primary mb-6">Annual Budget Breakdown</h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  We believe you deserve to know exactly how your contributions are used. 
                  Our financial records are reviewed annually and available upon request.
                </p>
                <FundingProgress label={fund.name} current={totalRaised} goal={goal} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <BudgetChart fund={fund} totalRaised={totalRaised} />
              </motion.div>
            </div>

            {/* Cost Breakdown Table */}
            {fund.itemization?.length > 0 && (
              <div className="mt-16">
                <h3 className="font-heading text-2xl text-primary mb-6">Cost Breakdown</h3>
                <div className="space-y-3">
                  {fund.itemization.map((item, idx) => {
                    const percentage = goal > 0 ? Math.round((item.amount / goal) * 100) : 0;
                    return (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50">
                        <span className="font-body text-sm text-foreground">{item.label}</span>
                        <div className="flex items-center gap-6">
                          <span className="font-body text-sm text-muted-foreground">${parseFloat(item.amount).toLocaleString()}</span>
                          <span className="font-body text-sm font-medium text-primary min-w-[50px] text-right">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center py-3 font-semibold border-t-2 border-primary">
                    <span className="font-heading text-primary">Total</span>
                    <span className="font-heading text-primary">${goal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Donation Form */}
      <DonationForm 
        fund={fund}
        donationSubmitted={donationSubmitted}
        setDonationSubmitted={setDonationSubmitted}
      />
    </>
  );
}