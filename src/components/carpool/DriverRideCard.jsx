import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Phone, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function DriverRideCard({ ride, requests, onRefresh }) {
  const [expanded, setExpanded] = useState(true);
  const [updating, setUpdating] = useState(null);

  const acceptedCount = requests.filter(r => r.status === 'accepted').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const updateRequest = async (reqId, status) => {
    setUpdating(reqId);
    await base44.entities.RideRequest.update(reqId, { status });
    onRefresh();
    setUpdating(null);
  };

  const cancelRide = async () => {
    await base44.entities.CarpoolRide.update(ride.id, { status: 'cancelled' });
    onRefresh();
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-body font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> {ride.pickup_location}
            </p>
            <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              {ride.pickup_time ? format(new Date(ride.pickup_time), 'EEE, MMM d · h:mm a') : 'Time TBD'}
            </p>
            <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              {acceptedCount} confirmed / {ride.capacity} seats · {pendingCount} pending
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-body font-medium px-2 py-1 rounded-full ${
              ride.status === 'active' ? 'bg-green-100 text-green-700' :
              ride.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-secondary text-muted-foreground'
            }`}>
              {ride.status}
            </span>
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-muted-foreground hover:text-foreground"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 pb-5">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-4 mb-3">Riders</p>
          {requests.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground italic">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="flex items-center justify-between gap-3 bg-secondary/40 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{req.student_name}</p>
                    <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {req.student_phone}
                    </p>
                    {req.notes && <p className="font-body text-xs text-muted-foreground italic mt-0.5">"{req.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateRequest(req.id, 'accepted')}
                          disabled={updating === req.id}
                          className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => updateRequest(req.id, 'declined')}
                          disabled={updating === req.id}
                          className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    {req.status === 'accepted' && (
                      <span className="text-xs font-body text-green-700 font-medium">Confirmed</span>
                    )}
                    {req.status === 'declined' && (
                      <span className="text-xs font-body text-muted-foreground">Declined</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ride.status === 'active' && (
            <button
              onClick={cancelRide}
              className="mt-4 font-body text-xs text-muted-foreground hover:text-destructive underline"
            >
              Cancel this ride
            </button>
          )}
        </div>
      )}
    </div>
  );
}