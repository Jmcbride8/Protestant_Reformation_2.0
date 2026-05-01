import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFeatures } from '@/lib/FeatureContext';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { HandCoins } from 'lucide-react';
import GivingTabs from '../components/giving/GivingTabs';
import GroupFundSection from '../components/giving/GroupFundSection';
import AnnualBudgetSection from '../components/giving/AnnualBudgetSection';
import FundCampaignSection from '../components/giving/FundCampaignSection';
import { useQuery } from '@tanstack/react-query';

export default function Giving() {
  const [activeTab, setActiveTab] = useState('budget');
  const [user, setUser] = useState(null);
  const { isEnabled } = useFeatures();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Load active funds
  const { data: allFunds = [] } = useQuery({
    queryKey: ['allFundSettings'],
    queryFn: async () => {
      const funds = await base44.entities.FundSettings.list('sort_order', 50);
      return funds.filter(f => f.status === 'active');
    },
  });

  const annualFund = allFunds.find(f => f.is_annual_budget);
  const otherFunds = allFunds.filter(f => !f.is_annual_budget);

  // Look up the member's profile to find their group
  const { data: memberProfiles = [] } = useQuery({
    queryKey: ['myMemberProfile', user?.email],
    queryFn: () => base44.entities.MemberProfile.filter({ email: user?.email }),
    enabled: !!user?.email,
  });
  const myProfile = memberProfiles[0];

  // Load the group if they have one
  const { data: myGroup } = useQuery({
    queryKey: ['myGroup', myProfile?.small_group_id],
    queryFn: () => base44.entities.CommunityGroup.get(myProfile.small_group_id),
    enabled: !!myProfile?.small_group_id,
  });

  const showGroupTab = !!myGroup;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Generosity</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Give with <span className="italic">Joy</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Every gift supports our mission to serve Santa Barbara with love. 
              We believe in full transparency — here's exactly where your generosity goes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Switcher */}
      <section className="pt-12 pb-4 bg-background">
        <GivingTabs active={activeTab} onChange={setActiveTab} showGroup={showGroupTab} />
      </section>

      {/* ── ANNUAL BUDGET TAB ── */}
      {activeTab === 'budget' && annualFund && (
        <AnnualBudgetSection fund={annualFund} isEnabled={isEnabled} />
      )}

      {/* ── SPECIAL FUNDS TAB ── */}
      {activeTab === 'funds' && (
        <div className="bg-background min-h-[40vh]">
          <FundCampaignSection funds={otherFunds} />
        </div>
      )}

      {/* ── GROUP FUND TAB ── */}
      {activeTab === 'group' && showGroupTab && (
        <div className="bg-background min-h-[40vh]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GroupFundSection group={myGroup} user={user} />
          </div>
        </div>
      )}
    </div>
  );
}