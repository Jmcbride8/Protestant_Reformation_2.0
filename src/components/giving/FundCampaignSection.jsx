import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { CheckCircle, Target } from 'lucide-react';
import FundingProgress from './FundingProgress';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

function FundCard({ fund }) {
   const [amount, setAmount] = useState('');
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [frequency, setFrequency] = useState('one_time');
   const [submitted, setSubmitted] = useState(false);

  // Fetch total donated to this fund
  const { data: donations = [] } = useQuery({
    queryKey: ['fundDonations', fund.slug],
    queryFn: () => base44.entities.Donation.filter({ fund: fund.slug }),
  });

  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const goal = fund.goal ?? 0;

  const handlePledge = async (e) => {
    e.preventDefault();
    await base44.entities.Donation.create({
      donor_name: name,
      donor_email: email,
      amount: parseFloat(amount),
      fund: fund.slug,
      donation_date: new Date().toISOString().split('T')[0],
      is_recurring: frequency !== 'one_time',
      notes: frequency !== 'one_time' ? `Recurring: ${frequency}` : '',
    });
    setSubmitted(true);
    toast.success("Thank you for your generous pledge!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-24 bg-background border-t border-border/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Special Fund</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">{fund.name}</h2>
          {fund.description && (
            <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">{fund.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Progress + Itemization */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-primary">{fund.name}</h3>
                {goal > 0 && (
                  <p className="font-body text-sm text-muted-foreground">Goal: ${goal.toLocaleString()}</p>
                )}
              </div>
            </div>

            {goal > 0 && (
              <FundingProgress
                label="Total Raised"
                current={totalRaised}
                goal={goal}
                color="hsl(38, 45%, 60%)"
              />
            )}

            {fund.itemization?.length > 0 && (
              <div className="mt-8">
                <h4 className="font-heading text-lg text-primary mb-4">Cost Breakdown</h4>
                <div className="space-y-3">
                  {fund.itemization.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="font-body text-sm text-foreground">{item.label}</span>
                      <span className="font-body text-sm font-medium text-primary">${parseFloat(item.amount).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-semibold">
                    <span className="font-heading text-primary">Total</span>
                    <span className="font-heading text-primary">
                      ${fund.itemization.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Pledge Form */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-primary mb-2">Thank You!</h3>
                <p className="font-body text-muted-foreground">
                  Your generous pledge has been recorded. We'll be in touch with details.
                </p>
                <Button className="mt-6 font-body" onClick={() => { setSubmitted(false); setAmount(''); setName(''); setEmail(''); setFrequency('one_time'); }}>
                  Give Again
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handlePledge} className="space-y-6">
                <h3 className="font-heading text-2xl text-primary mb-2">Make a Pledge</h3>
                {fund.description && (
                  <p className="font-body text-sm text-muted-foreground mb-6">{fund.description}</p>
                )}
                <div className="space-y-2">
                  <Label className="font-body text-sm">Your Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="John & Jane Smith" required className="font-body" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="font-body" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Pledge Amount ($)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500" min="1" required className="font-body" />
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
                        onClick={() => setFrequency(value)}
                        className={`font-body text-sm py-2 px-3 rounded-lg border transition-colors ${
                          frequency === value
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
                  Submit Pledge
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FundCampaignSection() {
  const { data: funds = [] } = useQuery({
    queryKey: ['activeFundSettings'],
    queryFn: () => base44.entities.FundSettings.filter({ is_active: true }, 'sort_order', 50),
  });

  if (funds.length === 0) return null;

  return (
    <>
      {funds.map(fund => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </>
  );
}