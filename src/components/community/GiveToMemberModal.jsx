import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, HandCoins, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const AMOUNTS = [25, 50, 100, 250];

export default function GiveToMemberModal({ post, user, onClose }) {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Donation.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Your gift has been recorded. Thank you!");
    },
  });

  const finalAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;
    mutation.mutate({
      donor_name: user?.full_name || 'Anonymous',
      donor_email: user?.email || '',
      amount: finalAmount,
      fund: 'general',
      notes: `Community support gift for: "${post.title}" — ${note}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border/50 p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-green-600" />
            <h3 className="font-heading text-xl text-primary">Give Financially</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-accent mx-auto mb-3" />
            <h4 className="font-heading text-2xl text-primary mb-2">Gift Recorded</h4>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Your generosity has been noted. Our team will reach out to coordinate the gift with the recipient.
            </p>
            <Button className="mt-6 font-body bg-primary hover:bg-primary/90" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="bg-secondary/40 rounded-xl p-4 mb-5">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">Supporting</p>
              <p className="font-heading text-base text-primary">{post.title}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Posted by {post.is_anonymous ? 'Anonymous' : (post.contact_name || 'A member')}
                {post.group_name ? ` · ${post.group_name}` : ''}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-body text-sm mb-2 block">Choose an amount</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                      className={`py-2 rounded-lg border text-sm font-body font-medium transition-colors ${amount === String(a) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`w-full py-2 rounded-lg border text-sm font-body font-medium transition-colors ${amount === 'custom' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
                >
                  Custom Amount
                </button>
                {amount === 'custom' && (
                  <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-sm">$</span>
                    <Input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="font-body pl-7"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label className="font-body text-sm">Note (optional)</Label>
                <Textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a personal message..."
                  className="font-body h-20"
                />
              </div>

              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                This records your intent to give. Our pastoral team will coordinate the details and ensure the gift reaches the right person.
              </p>

              <Button
                type="submit"
                disabled={mutation.isPending || !finalAmount || finalAmount <= 0}
                className="w-full font-body bg-green-700 hover:bg-green-800 text-white"
              >
                {mutation.isPending ? 'Recording...' : `Give ${finalAmount > 0 ? `$${finalAmount}` : ''}`}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}