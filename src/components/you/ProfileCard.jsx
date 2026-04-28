import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body text-muted-foreground">
      {profile.phone && (
        <div><span className="text-foreground font-medium">Phone:</span> {profile.phone}</div>
      )}
      {profile.joined_date && (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Member since {format(new Date(profile.joined_date), 'MMMM yyyy')}</span>
        </div>
      )}
      {profile.baptized && (
        <div className="flex items-center gap-1.5 text-accent">
          <Heart className="w-3.5 h-3.5" />
          <span>Baptized</span>
        </div>
      )}
      {profile.spiritual_gifts?.length > 0 && (
        <div className="sm:col-span-2">
          <span className="text-foreground font-medium">Spiritual Gifts: </span>
          {profile.spiritual_gifts.join(', ')}
        </div>
      )}
    </div>
  );
}