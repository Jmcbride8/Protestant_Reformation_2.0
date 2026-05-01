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