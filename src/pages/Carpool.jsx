import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Car, MapPin, Clock, Users, Phone, Plus } from 'lucide-react';
import { format, isSameDay, startOfDay } from 'date-fns';
import OfferRideForm from '@/components/carpool/OfferRideForm';
import RequestRideModal from '@/components/carpool/RequestRideModal';
import DriverRideCard from '@/components/carpool/DriverRideCard';

export default function Carpool() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [requestingRide, setRequestingRide] = useState(null);
  const [activeTab, setActiveTab] = useState('find');
  const [selectedDate, setSelectedDate] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(user => setCurrentUser(user)).catch(() => {});
  }, []);

  const { data: allRides = [] } = useQuery({
    queryKey: ['carpoolRides'],
    queryFn: () => base44.entities.CarpoolRide.list('-pickup_time'),
  });

  const activeRides = allRides.filter(r => r.status === 'active');

  const rideDates = activeRides
    .filter(r => r.pickup_time)
    .map(r => startOfDay(new Date(r.pickup_time)));

  const filteredRides = selectedDate
    ? activeRides.filter(r => r.pickup_time && isSameDay(new Date(r.pickup_time), selectedDate))
    : activeRides;
  const myRides = allRides.filter(r => currentUser && r.driver_user_id === currentUser.id);

  const { data: allRequests = [] } = useQuery({
    queryKey: ['rideRequests'],
    queryFn: () => base44.entities.RideRequest.list(),
  });

  const riderCounts = {};
  allRequests.forEach(req => {
    if (req.status !== 'declined') {
      riderCounts[req.carpool_ride_id] = (riderCounts[req.carpool_ride_id] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
            <Car className="w-4 h-4 text-accent" />
            <span className="font-body text-sm tracking-wide text-accent">College Carpool</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl mb-4">Rides to Church</h1>
          <p className="font-body text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            No car? No problem. Church members offer free rides to college students every Sunday.
            Just find a ride below and let the driver know you're coming.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('find')}
            className={`font-body text-sm pb-3 px-1 border-b-2 transition-colors ${activeTab === 'find' ? 'border-accent text-foreground font-semibold' : 'border-transparent text-muted-foreground'}`}
          >
            Find a Ride
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('myrides')}
              className={`font-body text-sm pb-3 px-1 border-b-2 transition-colors ${activeTab === 'myrides' ? 'border-accent text-foreground font-semibold' : 'border-transparent text-muted-foreground'}`}
            >
              My Rides {myRides.length > 0 && `(${myRides.length})`}
            </button>
          )}
        </div>

        {/* Find a Ride Tab */}
        {activeTab === 'find' && (
          <div className="space-y-6">
            {/* Calendar + Rides side by side */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Calendar */}
              <div className="bg-card border border-border rounded-xl p-3 shadow-sm shrink-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => setSelectedDate(date && selectedDate && isSameDay(date, selectedDate) ? null : date)}
                  modifiers={{ hasRide: rideDates }}
                  modifiersStyles={{ hasRide: { fontWeight: 'bold', textDecoration: 'underline', color: 'hsl(var(--accent))' } }}
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-full mt-2 font-body text-xs text-muted-foreground hover:text-foreground underline text-center"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {/* Rides list */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">
                    {selectedDate ? `Rides on ${format(selectedDate, 'MMM d')}` : 'Available Rides'}
                  </h2>
                  {currentUser ? (
                    <Button onClick={() => setShowOfferForm(true)} size="sm" className="gap-2">
                      <Plus className="w-4 h-4" /> Offer a Ride
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => base44.auth.redirectToLogin()} className="gap-2">
                      Sign in to Offer a Ride
                    </Button>
                  )}
                </div>

                {filteredRides.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Car className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-body">{selectedDate ? 'No rides on this day.' : 'No rides listed yet. Check back soon!'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRides.map(ride => {
                      const takenSpots = riderCounts[ride.id] || 0;
                      const openSpots = ride.capacity - takenSpots;
                      const isFull = openSpots <= 0;
                      return (
                        <div key={ride.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                  <Car className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                  <p className="font-body font-semibold text-foreground">{ride.driver_name}</p>
                                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {ride.driver_phone}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 pl-10">
                                <p className="font-body text-sm text-foreground flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-accent shrink-0" />
                                  {ride.pickup_location}
                                </p>
                                <p className="font-body text-sm text-foreground flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-accent shrink-0" />
                                  {ride.pickup_time ? format(new Date(ride.pickup_time), 'EEE, MMM d · h:mm a') : 'Time TBD'}
                                </p>
                                {ride.destination && (
                                  <p className="font-body text-xs text-muted-foreground">→ {ride.destination}</p>
                                )}
                                {ride.notes && (
                                  <p className="font-body text-xs text-muted-foreground italic mt-1">"{ride.notes}"</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 shrink-0">
                              <div className={`flex items-center gap-1 text-sm font-body font-medium ${isFull ? 'text-destructive' : 'text-green-700'}`}>
                                <Users className="w-4 h-4" />
                                {isFull ? 'Full' : `${openSpots} spot${openSpots !== 1 ? 's' : ''} left`}
                              </div>
                              <Button
                                size="sm"
                                disabled={isFull}
                                onClick={() => setRequestingRide(ride)}
                                variant={isFull ? 'secondary' : 'default'}
                              >
                                {isFull ? 'Full' : 'Request Ride'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Rides Tab */}
        {activeTab === 'myrides' && currentUser && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading text-2xl text-primary">My Offered Rides</h2>
              <Button onClick={() => setShowOfferForm(true)} size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Offer Another
              </Button>
            </div>
            {myRides.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Car className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-body">You haven't offered any rides yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {myRides.map(ride => (
                  <DriverRideCard
                    key={ride.id}
                    ride={ride}
                    currentUser={currentUser}
                    requests={allRequests.filter(r => r.carpool_ride_id === ride.id)}
                    onRefresh={() => queryClient.invalidateQueries({ queryKey: ['rideRequests', 'carpoolRides'] })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showOfferForm && (
        <OfferRideForm
          currentUser={currentUser}
          onClose={() => setShowOfferForm(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['carpoolRides'] });
            setShowOfferForm(false);
            setActiveTab('myrides');
          }}
        />
      )}

      {requestingRide && (
        <RequestRideModal
          ride={requestingRide}
          onClose={() => setRequestingRide(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['rideRequests'] });
            setRequestingRide(null);
          }}
        />
      )}
    </div>
  );
}