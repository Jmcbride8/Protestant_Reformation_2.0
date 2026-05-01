import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFeatures } from '@/lib/FeatureContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { HandCoins, CheckCircle } from 'lucide-react';
import BudgetChart from '../components/giving/BudgetChart';
import FundingProgress from '../components/giving/FundingProgress';
import FundCampaignSection from '../components/giving/FundCampaignSection';
import GivingTabs from '../components/giving/GivingTabs';
import GroupFundSection from '../components/giving/GroupFundSection';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

export default function Giving() {
  const [activeTab, setActiveTab] = useState('budget');
  const [user, setUser] = useState(null);
  const [donationForm, setDonationForm] = useState({ name: '', email: '', amount: '', fundId: '', frequency: 'one_time' });
  const [donationSubmitted, setDonationSubmitted] = useState(false);
  const { isEnabled } = useFeatures();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    // Set default fundId when funds load
    if (allFunds.length > 0 && !donationForm.fundId) {
      const annualFund = allFunds.find(f => f.slug === 'annual_fund');
      setDonationForm(prev => ({
        ...prev,
        fundId: annualFund?.id || allFunds[0].id
      }));
    }
  }, [allFunds]);

  const { data: allFunds = [] } = useQuery({
    queryKey: ['allFundSettings'],
    queryFn: async () => {
      const funds = await base44.entities.FundSettings.list('sort_order', 50);
      return funds.filter(f => f.status === 'active' || f.status === undefined);
    },
  });

  const annualFund = allFunds.find(f => f.slug === 'annual_fund');
  const fundGoal = annualFund?.goal ?? 250000;
  const fundCurrent = annualFund?.current ?? 187000;
  
  const defaultFundId = annualFund?.id || '';

  // Look up the member's profile to find their group
  const { data: memberProfiles = [] } = useQuery({
    queryKey: ['myMemberProfile', user?.email],
    queryFn: () => base44.entities.MemberProfile.filter({ email: user.email }),
    enabled: !!user?.email,
  });
  const myProfile = memberProfiles[0];

  // Load the group if they have one
  const { data: myGroup } = useQuery({
    queryKey: ['myGroup', myProfile?.small_group_id],
    queryFn: () => base44.entities.CommunityGroup.filter({ id: myProfile.small_group_id }),
    enabled: !!myProfile?.small_group_id,
    select: (data) => data[0],
  });

  const showGroupTab = !!myGroup;

  const handleDonation = async (e) => {
    e.preventDefault();
    const selectedFund = allFunds.find(f => f.id === donationForm.fundId);
    await base44.entities.Donation.create({
      donor_name: donationForm.name,
      donor_email: donationForm.email,
      amount: parseFloat(donationForm.amount),
      fund_id: donationForm.fundId,
      fund_name: selectedFund?.name || '',
      donation_date: new Date().toISOString().split('T')[0],
      is_recurring: donationForm.frequency !== 'one_time',
      notes: donationForm.frequency !== 'one_time' ? `Recurring: ${donationForm.frequency}` : '',
    });
    setDonationSubmitted(true);
    toast.success("Thank you for your generous gift!");
  };

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
      {activeTab === 'budget' && (
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
                    <FundingProgress label="Annual Fund" current={fundCurrent} goal={fundGoal} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <BudgetChart totalBudget={250000} />
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* Give Now */}
          <section className="py-24 bg-secondary/30">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-10">
                  <HandCoins className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h2 className="font-heading text-4xl text-primary mb-4">Make a Gift</h2>
                  <p className="font-body text-muted-foreground">Your generosity makes everything we do possible.</p>
                </div>

                {donationSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 bg-card rounded-2xl border border-border/50">
                    <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="font-heading text-2xl text-primary mb-2">Thank You!</h3>
                    <p className="font-body text-muted-foreground">Your gift has been recorded. You'll receive a receipt by email.</p>
                    <Button className="mt-6 font-body" onClick={() => { setDonationSubmitted(false); setDonationForm({ name: '', email: '', amount: '', fundId: defaultFundId, frequency: 'one_time' }); }}>
                      Make Another Gift
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleDonation} className="bg-card rounded-2xl border border-border/50 p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Your Name</Label>
                        <Input value={donationForm.name} onChange={(e) => setDonationForm({ ...donationForm, name: e.target.value })} placeholder="Your name" required className="font-body" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Email</Label>
                        <Input type="email" value={donationForm.email} onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} placeholder="your@email.com" required className="font-body" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Fund</Label>
                      <Select value={donationForm.fundId} onValueChange={(val) => setDonationForm({ ...donationForm, fundId: val })}>
                        <SelectTrigger className="font-body"><SelectValue placeholder="Select a fund" /></SelectTrigger>
                        <SelectContent>
                          {allFunds.map(fund => (
                            <SelectItem key={fund.id} value={fund.id}>{fund.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Amount ($)</Label>
                      <Input type="number" value={donationForm.amount} onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} placeholder="100" min="1" required className="font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Frequency</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: 'one_time', label: 'One-Time' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'annually', label: 'Annually' },
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setDonationForm({ ...donationForm, frequency: value })}
                            className={`font-body text-sm py-2 px-3 rounded-lg border transition-colors ${
                              donationForm.frequency === value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border hover:bg-secondary'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full font-body tracking-wide bg-primary hover:bg-primary/90" size="lg">
                      {donationForm.frequency === 'one_time' ? 'Give Now' : `Give ${donationForm.frequency.charAt(0).toUpperCase() + donationForm.frequency.slice(1)}`}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* ── SPECIAL FUNDS TAB ── */}
      {activeTab === 'funds' && (
        <div className="bg-background min-h-[40vh]">
          <FundCampaignSection />
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