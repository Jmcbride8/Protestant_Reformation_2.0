import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function RSVPModal({ event, user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    member_name: user?.full_name || '',
    member_email: user?.email || '',
    guest_count: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.CalendarEventRSVP.create({
      event_id: event.id,
      ...form,
      guest_count: Number(form.guest_count),
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-accent" />
            <h3 className="font-heading text-xl text-primary">RSVP</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5 p-3 bg-secondary/50 rounded-lg">
            <p className="font-heading text-base text-primary">{event.title}</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {format(new Date(event.date + 'T00:00:00'), 'EEEE, MMMM d')}
              {event.start_time ? ` • ${event.start_time}` : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Your Name *</label>
              <Input
                value={form.member_name}
                onChange={e => setForm(f => ({ ...f, member_name: e.target.value }))}
                required
                className="font-body"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Email *</label>
              <Input
                type="email"
                value={form.member_email}
                onChange={e => setForm(f => ({ ...f, member_email: e.target.value }))}
                required
                className="font-body"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Number Attending</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.guest_count}
                onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))}
                className="font-body w-24"
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">Notes (optional)</label>
              <Input
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="font-body"
                placeholder="Any dietary needs, etc."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-body border-border text-foreground hover:bg-secondary">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 font-body bg-accent hover:bg-accent/90 text-white">
                {loading ? 'Submitting…' : 'Confirm RSVP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}