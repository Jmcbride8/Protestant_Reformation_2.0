import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { base44 } from '@/api/base44Client';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";

const categoryLabels = {
  setup: 'Setup', greeting: 'Greeting', kitchen: 'Kitchen',
  childcare: 'Childcare', worship: 'Worship', cleanup: 'Cleanup',
  events: 'Events', outreach: 'Outreach', other: 'Other',
};

export default function NeedCard({ need, onSignup }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const spotsLeft = need.slots_needed - (need.slots_filled || 0);
  const isFull = spotsLeft <= 0;

  const handleSignup = async (e) => {
    e.preventDefault();
    await base44.entities.VolunteerSignup.create({
      volunteer_need_id: need.id,
      volunteer_name: name,
      volunteer_email: email,
    });
    await base44.entities.VolunteerNeed.update(need.id, {
      slots_filled: (need.slots_filled || 0) + 1,
      status: spotsLeft <= 1 ? 'full' : 'open',
    });
    setSubmitted(true);
    toast.success("You're signed up! Thank you!");
    if (onSignup) onSignup();
  };

  return (
    <div className="p-5 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-heading text-lg text-primary">{need.title}</h4>
          <p className="font-body text-xs text-muted-foreground">
            {format(new Date(need.date + 'T00:00:00'), 'EEEE, MMMM d')}
          </p>
        </div>
        {need.category && (
          <Badge variant="secondary" className="font-body text-xs">
            {categoryLabels[need.category] || need.category}
          </Badge>
        )}
      </div>

      {need.description && (
        <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">{need.description}</p>
      )}

      <div className="flex items-center gap-4 mb-4 text-sm">
        {(need.start_time || need.end_time) && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-body text-xs">{need.start_time}{need.end_time ? ` - ${need.end_time}` : ''}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span className={`font-body text-xs ${isFull ? 'text-destructive' : ''}`}>
            {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            disabled={isFull}
            className="w-full font-body text-xs bg-primary hover:bg-primary/90"
          >
            {isFull ? 'Fully Booked' : 'Sign Up to Volunteer'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{need.title}</DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="font-heading text-lg text-primary">You're signed up!</p>
              <p className="font-body text-sm text-muted-foreground mt-1">We'll send a confirmation to your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Your Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="font-body" />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="font-body" />
              </div>
              <Button type="submit" className="w-full font-body bg-primary hover:bg-primary/90">
                Confirm Sign Up
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}