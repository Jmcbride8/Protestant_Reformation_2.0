import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function RequestRideModal({ ride, onClose, onSuccess }) {
  const [form, setForm] = useState({ student_name: '', student_phone: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.RideRequest.create({
      ...form,
      carpool_ride_id: ride.id,
      status: 'pending',
    });
    setSaving(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🙌</span>
            </div>
            <h2 className="font-heading text-2xl text-primary mb-2">You're on the list!</h2>
            <p className="font-body text-muted-foreground text-sm mb-1">
              <strong>{ride.driver_name}</strong> has your name and number.
            </p>
            <p className="font-body text-muted-foreground text-sm mb-6">
              They'll be at <strong>{ride.pickup_location}</strong> around <strong>{ride.pickup_time ? format(new Date(ride.pickup_time), 'h:mm a') : 'the listed time'}</strong>.
            </p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-2xl text-primary mb-2">Request This Ride</h2>
            <div className="bg-secondary/50 rounded-lg p-3 mb-5 space-y-1">
              <p className="font-body text-sm text-foreground flex items-center gap-2">
                <MapPin className="w-3 h-3 text-accent" /> {ride.pickup_location}
              </p>
              <p className="font-body text-sm text-foreground flex items-center gap-2">
                <Clock className="w-3 h-3 text-accent" />
                {ride.pickup_time ? format(new Date(ride.pickup_time), 'EEE, MMM d · h:mm a') : 'Time TBD'}
              </p>
              <p className="font-body text-xs text-muted-foreground">Driver: {ride.driver_name} · {ride.driver_phone}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">Your Name</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.student_name}
                  onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))}
                  placeholder="First & Last Name"
                  required
                />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">Your Cell Number</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.student_phone}
                  onChange={e => setForm(f => ({ ...f, student_phone: e.target.value }))}
                  placeholder="(805) 555-0000"
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
                  placeholder="Anything the driver should know"
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Sending...' : 'Let the Driver Know'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}