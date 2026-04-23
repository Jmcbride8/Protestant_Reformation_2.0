import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function OfferRideForm({ currentUser, onClose, onSuccess }) {
  const [form, setForm] = useState({
    driver_name: currentUser?.full_name || '',
    driver_phone: '',
    pickup_location: '',
    pickup_time: '',
    destination: 'Hope Church Santa Barbara',
    capacity: 3,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.CarpoolRide.create({
      ...form,
      capacity: Number(form.capacity),
      driver_user_id: currentUser?.id || '',
      status: 'active',
    });
    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-heading text-2xl text-primary mb-5">Offer a Ride</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Your Name</label>
            <input
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.driver_name}
              onChange={e => setForm(f => ({ ...f, driver_name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Your Cell Number</label>
            <input
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.driver_phone}
              onChange={e => setForm(f => ({ ...f, driver_phone: e.target.value }))}
              placeholder="(805) 555-0000"
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Pickup Location</label>
            <input
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.pickup_location}
              onChange={e => setForm(f => ({ ...f, pickup_location: e.target.value }))}
              placeholder="e.g. UCSB Storke Tower, corner of El Colegio & Phelps"
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Pickup Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.pickup_time}
              onChange={e => setForm(f => ({ ...f, pickup_time: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Seats Available</label>
            <input
              type="number"
              min={1}
              max={8}
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.capacity}
              onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Notes (optional)</label>
            <textarea
              className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. I drive a blue Toyota, will wait 5 min"
            />
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Posting...' : 'Post Ride'}
          </Button>
        </form>
      </div>
    </div>
  );
}