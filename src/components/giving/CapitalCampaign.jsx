import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { Building2, CheckCircle } from 'lucide-react';
import FundingProgress from './FundingProgress';
import { toast } from "sonner";

const campaignBreakdown = [
  { item: "Roof Restoration", cost: 12000 },
  { item: "HVAC System Update", cost: 8000 },
  { item: "Sanctuary Lighting", cost: 5000 },
  { item: "Accessible Restrooms", cost: 3000 },
  { item: "Landscaping & Exterior", cost: 2000 },
];

export default function CapitalCampaign() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePledge = async (e) => {
    e.preventDefault();
    await base44.entities.Donation.create({
      donor_name: name,
      donor_email: email,
      amount: parseFloat(amount),
      fund: 'building_campaign',
    });
    setSubmitted(true);
    toast.success("Thank you for your generous pledge!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-heading text-2xl text-primary">Building Renovation Fund</h3>
            <p className="font-body text-sm text-muted-foreground">Goal: $30,000</p>
          </div>
        </div>

        <FundingProgress 
          label="Total Raised" 
          current={18750} 
          goal={30000} 
          color="hsl(38, 45%, 60%)" 
        />

        <div className="mt-8">
          <h4 className="font-heading text-lg text-primary mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            {campaignBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="font-body text-sm text-foreground">{item.item}</span>
                <span className="font-body text-sm font-medium text-primary">${item.cost.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 font-semibold">
              <span className="font-heading text-primary">Total</span>
              <span className="font-heading text-primary">$30,000</span>
            </div>
          </div>
        </div>
      </div>

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
          </motion.div>
        ) : (
          <form onSubmit={handlePledge} className="space-y-6">
            <h3 className="font-heading text-2xl text-primary mb-2">Make a Pledge</h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Support the renovation of our historic sanctuary.
            </p>
            <div className="space-y-2">
              <Label className="font-body text-sm">Your Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John & Jane Smith"
                required 
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com"
                required 
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Pledge Amount ($)</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="500"
                min="1"
                required 
                className="font-body"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[50, 100, 250, 500, 1000].map(val => (
                <Button 
                  key={val} 
                  type="button" 
                  variant={amount === String(val) ? "default" : "outline"} 
                  size="sm"
                  className="font-body text-xs"
                  onClick={() => setAmount(String(val))}
                >
                  ${val}
                </Button>
              ))}
            </div>
            <Button type="submit" className="w-full font-body tracking-wide bg-primary hover:bg-primary/90" size="lg">
              Submit Pledge
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}