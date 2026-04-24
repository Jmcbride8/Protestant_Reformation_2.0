import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import RSVPModal from './RSVPModal';

const categoryColors = {
  worship: 'bg-primary text-primary-foreground',
  community: 'bg-accent/80 text-white',
  prayer: 'bg-purple-500 text-white',
  youth: 'bg-emerald-500 text-white',
  outreach: 'bg-blue-500 text-white',
  other: 'bg-muted-foreground text-white',
};

const categoryDots = {
  worship: 'bg-primary',
  community: 'bg-accent',
  prayer: 'bg-purple-500',
  youth: 'bg-emerald-500',
  outreach: 'bg-blue-500',
  other: 'bg-muted-foreground',
};

export default function ChurchCalendar({ user }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [rsvpEvent, setRsvpEvent] = useState(null);

  const { data: events = [], refetch } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => base44.entities.CalendarEvent.list('date', 200),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ['calendarRsvps'],
    queryFn: () => base44.entities.CalendarEventRSVP.list('-created_date', 500),
  });

  const activeEvents = events.filter(e => e.is_active !== false);

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (d) =>
    activeEvents.filter(e => e.date === format(d, 'yyyy-MM-dd'));

  const selectedDayEvents = getEventsForDay(selectedDay);

  const getRsvpCount = (eventId) =>
    rsvps.filter(r => r.event_id === eventId).reduce((sum, r) => sum + (r.guest_count || 1), 0);

  const userRsvp = (eventId) =>
    user ? rsvps.find(r => r.event_id === eventId && r.member_email === user.email) : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-primary-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDay(new Date()); }}
            className="text-primary-foreground hover:bg-primary-foreground/10 font-body text-xs">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-body text-xs text-primary-foreground/50 uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(d);
          const isSelected = isSameDay(d, selectedDay);
          const isCurrentMonth = isSameMonth(d, currentMonth);
          const todayDay = isToday(d);
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(d)}
              className={`relative min-h-[52px] p-1.5 rounded-lg text-left transition-all ${
                isSelected ? 'bg-primary-foreground/20 ring-2 ring-primary-foreground/40' :
                'hover:bg-primary-foreground/10'
              } ${!isCurrentMonth ? 'opacity-30' : ''}`}
            >
              <span className={`font-body text-sm block text-center mb-1 w-7 h-7 flex items-center justify-center rounded-full mx-auto ${
                todayDay ? 'bg-accent text-white font-semibold' :
                isSelected ? 'text-primary-foreground font-semibold' :
                'text-primary-foreground/80'
              }`}>
                {format(d, 'd')}
              </span>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <span key={idx} className={`w-1.5 h-1.5 rounded-full ${categoryDots[e.category] || 'bg-muted-foreground'}`} />
                ))}
                {dayEvents.length > 3 && (
                  <span className="font-body text-[9px] text-primary-foreground/60">+{dayEvents.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Events */}
      <div className="mt-4">
        <p className="font-body text-sm text-primary-foreground/60 mb-3">
          {format(selectedDay, 'EEEE, MMMM d')}
        </p>
        {selectedDayEvents.length === 0 ? (
          <p className="font-body text-sm text-primary-foreground/40 italic">No events scheduled</p>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map(event => {
              const rsvpCount = getRsvpCount(event.id);
              const myRsvp = userRsvp(event.id);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-foreground/10 rounded-xl p-4 border border-primary-foreground/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-heading text-base text-primary-foreground">{event.title}</h4>
                        <Badge className={`font-body text-[10px] capitalize ${categoryColors[event.category]}`}>
                          {event.category}
                        </Badge>
                        {event.is_rsvp_enabled && (
                          <Badge className="font-body text-[10px] bg-accent/30 text-primary-foreground border border-accent/40">
                            RSVP
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="font-body text-xs text-primary-foreground/60 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-primary-foreground/60">
                        {event.start_time && (
                          <span className="flex items-center gap-1 font-body text-xs">
                            <Clock className="w-3 h-3" />
                            {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1 font-body text-xs">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                        {event.is_rsvp_enabled && (
                          <span className="flex items-center gap-1 font-body text-xs">
                            <Users className="w-3 h-3" />
                            {rsvpCount} attending{event.rsvp_limit ? ` / ${event.rsvp_limit} max` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.is_rsvp_enabled && (
                      <div className="shrink-0">
                        {myRsvp ? (
                          <span className="font-body text-xs text-emerald-400 font-medium">✓ Going</span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setRsvpEvent(event)}
                            className="font-body text-xs bg-accent hover:bg-accent/90 text-white"
                          >
                            RSVP
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {rsvpEvent && (
        <RSVPModal
          event={rsvpEvent}
          user={user}
          onClose={() => setRsvpEvent(null)}
          onSuccess={() => {
            setRsvpEvent(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}