import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BecomeMemberModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    how_long_attending: '',
    testimony: '',
    baptized: false,
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.MembershipRequest.create(data),
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border/50 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl text-primary">Become a Member</h2>
            <p className="font-body text-sm text-muted-foreground mt-0.5">Join the Hope Church family</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading text-2xl text-primary mb-2">Application Received!</h3>
            <p className="font-body text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
              Thank you, {form.full_name}. Our team will prayerfully review your application and be in touch soon.
            </p>
            <Button onClick={onClose} className="font-body bg-primary">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-body text-sm">Full Name *</Label>
                <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className="font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="font-body" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-body text-sm">Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="font-body" placeholder="(805) 555-0000" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">How long have you been attending?</Label>
                <Input value={form.how_long_attending} onChange={e => setForm(f => ({ ...f, how_long_attending: e.target.value }))} className="font-body" placeholder="e.g. 6 months" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="font-body text-sm">Your Testimony *</Label>
              <Textarea
                value={form.testimony}
                onChange={e => setForm(f => ({ ...f, testimony: e.target.value }))}
                required
                className="font-body h-28"
                placeholder="Share a bit about your faith journey and why you'd like to become a member of Hope Church..."
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.baptized}
                onChange={e => setForm(f => ({ ...f, baptized: e.target.checked }))}
                className="rounded"
              />
              <span className="font-body text-sm text-muted-foreground">I have been baptized</span>
            </label>
            <p className="font-body text-xs text-muted-foreground leading-relaxed border-t pt-4">
              Your application will be reviewed by our pastoral team. We'll reach out within 1–2 weeks.
            </p>
            <Button type="submit" disabled={mutation.isPending} className="w-full font-body bg-primary hover:bg-primary/90">
              {mutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}