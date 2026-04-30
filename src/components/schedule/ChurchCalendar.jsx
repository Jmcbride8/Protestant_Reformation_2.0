import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
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



  const getRsvpCount = (eventId) =>
    rsvps.filter(r => r.event_id === eventId).reduce((sum, r) => sum + (r.guest_count || 1), 0);

  const userRsvp = (eventId) =>
    user ? rsvps.find(r => r.event_id === eventId && r.member_email === user.email) : null;

  return (
    <div className="space-y-6 relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}
           className="font-body text-xs">
           Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
       <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-body text-xs text-muted-foreground uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
           const dayEvents = getEventsForDay(d);
           const isSelected = selectedDay && isSameDay(d, selectedDay);
           const isHovered = hoveredDay && isSameDay(d, hoveredDay);
           const isCurrentMonth = isSameMonth(d, currentMonth);
           const todayDay = isToday(d);
           return (
             <button
               key={i}
               onClick={() => { 
                 if (isSelected) {
                   setSelectedDay(null);
                 } else if (getEventsForDay(d).length > 0) {
                   setSelectedDay(d);
                 }
               }}
               onMouseEnter={() => { if (!isSelected && dayEvents.length > 0) setHoveredDay(d); }}
               onMouseLeave={() => { if (!isSelected) setHoveredDay(null); }}
               className={`relative min-h-[52px] p-1.5 rounded-lg text-left transition-all ${
                 isSelected ? 'bg-secondary ring-2 ring-border' :
                 isHovered ? 'bg-secondary/60' :
                 'hover:bg-secondary/60'
               } ${!isCurrentMonth ? 'opacity-30' : ''}`}
             >
              <span className={`font-body text-sm block text-center mb-1 w-7 h-7 flex items-center justify-center rounded-full mx-auto ${
                todayDay ? 'bg-accent text-white font-semibold' :
                isSelected || isHovered ? 'text-primary font-semibold' :
                'text-foreground/80'
              }`}>
                {format(d, 'd')}
              </span>
              <div className="flex flex-wrap gap-1 justify-center">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <span key={idx} className="w-2.5 h-2.5 rounded-full bg-accent" />
                ))}
                {dayEvents.length > 3 && (
                  <span className="font-body text-[9px] text-primary-foreground/60">+{dayEvents.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Events Popup - Show on hover or when selected */}
      {(hoveredDay || selectedDay) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border/50 rounded-xl p-4 shadow-lg z-50 max-w-sm pointer-events-auto"
        >
          <div className="mb-3">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Events</p>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-primary">{format(selectedDay || hoveredDay, 'EEEE, MMMM d')}</h3>
              {selectedDay && (
                <button onClick={() => setSelectedDay(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {getEventsForDay(selectedDay || hoveredDay).map(event => {
              const rsvpCount = getRsvpCount(event.id);
              const myRsvp = userRsvp(event.id);
              return (
                <div key={event.id} className="bg-secondary/40 rounded-lg p-3 border border-border/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-sm text-primary mb-1">{event.title}</h4>
                      {event.description && (
                        <p className="font-body text-xs text-muted-foreground mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-muted-foreground">
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
                            {rsvpCount} attending
                          </span>
                        )}
                      </div>
                    </div>
                    {event.is_rsvp_enabled && !userRsvp(event.id) && (
                      <Button
                        size="sm"
                        onClick={() => setRsvpEvent(event)}
                        className="font-body text-xs bg-accent hover:bg-accent/90 text-white shrink-0 mt-1"
                      >
                        RSVP
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
            </motion.div>
            </div>
            )}

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