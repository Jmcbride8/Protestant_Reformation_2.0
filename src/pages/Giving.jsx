import React, { useState } from 'react';
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
import CapitalCampaign from '../components/giving/CapitalCampaign';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

export default function Giving() {
  const [donationForm, setDonationForm] = useState({ name: '', email: '', amount: '', fund: 'general' });
  const [donationSubmitted, setDonationSubmitted] = useState(false);
  const { isEnabled } = useFeatures();

  const { data: fundSettings = [] } = useQuery({
    queryKey: ['fundSettings'],
    queryFn: () => base44.entities.FundSettings.filter({ key: 'annual_fund' }),
  });
  const fundRecord = fundSettings[0];
  const fundGoal = fundRecord?.goal ?? 250000;
  const fundCurrent = fundRecord?.current ?? 187000;

  const handleDonation = async (e) => {
    e.preventDefault();
    await base44.entities.Donation.create({
      donor_name: donationForm.name,
      donor_email: donationForm.email,
      amount: parseFloat(donationForm.amount),
      fund: donationForm.fund,
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

      {/* Budget Transparency */}
      {isEnabled('giving_annual_budget') && (
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Full Transparency</p>
              <h2 className="font-heading text-4xl text-primary mb-6">Annual Budget Breakdown</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                We believe you deserve to know exactly how your contributions are used. 
                Our financial records are reviewed annually and available upon request.
              </p>
              <FundingProgress label="Annual Fund" current={fundCurrent} goal={fundGoal} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <BudgetChart totalBudget={250000} />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Give Now */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <HandCoins className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="font-heading text-4xl text-primary mb-4">Make a Gift</h2>
              <p className="font-body text-muted-foreground">
                Your generosity makes everything we do possible.
              </p>
            </div>

            {donationSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-card rounded-2xl border border-border/50"
              >
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-primary mb-2">Thank You!</h3>
                <p className="font-body text-muted-foreground">Your gift has been recorded. You'll receive a receipt by email.</p>
                <Button className="mt-6 font-body" onClick={() => { setDonationSubmitted(false); setDonationForm({ name: '', email: '', amount: '', fund: 'general' }); }}>
                  Make Another Gift
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleDonation} className="bg-card rounded-2xl border border-border/50 p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Your Name</Label>
                    <Input 
                      value={donationForm.name} 
                      onChange={(e) => setDonationForm({ ...donationForm, name: e.target.value })} 
                      placeholder="Your name" 
                      required 
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Email</Label>
                    <Input 
                      type="email" 
                      value={donationForm.email} 
                      onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} 
                      placeholder="your@email.com" 
                      required 
                      className="font-body"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Fund</Label>
                  <Select value={donationForm.fund} onValueChange={(val) => setDonationForm({ ...donationForm, fund: val })}>
                    <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Fund</SelectItem>
                      <SelectItem value="building_campaign">Building Renovation</SelectItem>
                      <SelectItem value="missions">Missions & Outreach</SelectItem>
                      <SelectItem value="youth">Youth Ministry</SelectItem>
                      <SelectItem value="community_meals">Community Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Amount ($)</Label>
                  <Input 
                    type="number" 
                    value={donationForm.amount} 
                    onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} 
                    placeholder="100" 
                    min="1" 
                    required 
                    className="font-body"
                  />
                  <div className="flex gap-2 flex-wrap pt-2">
                    {[25, 50, 100, 250, 500].map(val => (
                      <Button 
                        key={val} 
                        type="button" 
                        variant={donationForm.amount === String(val) ? "default" : "outline"} 
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => setDonationForm({ ...donationForm, amount: String(val) })}
                      >
                        ${val}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full font-body tracking-wide bg-primary hover:bg-primary/90" size="lg">
                  Give Now
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Capital Campaign */}
      {isEnabled('giving_capital_campaign') && (
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Capital Campaign</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Renewing Our Home</h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Built in the 1950s, our church has served Santa Barbara for generations. 
              Help us preserve and renew this sacred space for generations to come.
            </p>
          </div>
          <CapitalCampaign />
        </div>
      </section>
      )}
    </div>
  );
}