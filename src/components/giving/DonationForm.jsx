import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandCoins, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

export default function DonationForm({ fund, donationSubmitted, setDonationSubmitted }) {
  const [form, setForm] = useState({ name: '', email: '', amount: '', frequency: 'one_time' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await base44.entities.Donation.create({
        donor_name: form.name,
        donor_email: form.email,
        amount: parseFloat(form.amount),
        fund_id: fund.id,
        fund_name: fund.name,
        donation_date: new Date().toISOString().split('T')[0],
        is_recurring: form.frequency !== 'one_time',
        notes: form.frequency !== 'one_time' ? `Recurring: ${form.frequency}` : '',
      });
      setDonationSubmitted(true);
      toast.success("Thank you for your generous gift!");
      setForm({ name: '', email: '', amount: '', frequency: 'one_time' });
    } catch (error) {
      toast.error("Failed to process donation");
    }
  };

  return (
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
              <Button 
                className="mt-6 font-body" 
                onClick={() => setDonationSubmitted(false)}
              >
                Make Another Gift
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-sm">Your Name</Label>
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Your name" 
                    required 
                    className="font-body" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Email</Label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="your@email.com" 
                    required 
                    className="font-body" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Amount ($)</Label>
                <Input 
                  type="number" 
                  value={form.amount} 
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                  placeholder="100" 
                  min="1" 
                  required 
                  className="font-body" 
                />
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
                      onClick={() => setForm({ ...form, frequency: value })}
                      className={`font-body text-sm py-2 px-3 rounded-lg border transition-colors ${
                        form.frequency === value
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
                {form.frequency === 'one_time' ? 'Give Now' : `Give ${form.frequency.charAt(0).toUpperCase() + form.frequency.slice(1)}`}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}