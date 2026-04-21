import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, isSameDay } from 'date-fns';
import VolunteerCalendar from '../components/volunteer/VolunteerCalendar';
import NeedCard from '../components/volunteer/NeedCard';
import { Heart } from 'lucide-react';

export default function Volunteer() {
  const [selectedDate, setSelectedDate] = useState(null);
  const queryClient = useQueryClient();

  const { data: needs = [] } = useQuery({
    queryKey: ['volunteerNeeds'],
    queryFn: () => base44.entities.VolunteerNeed.list('date', 100),
  });

  const filteredNeeds = selectedDate
    ? needs.filter(n => isSameDay(new Date(n.date + 'T00:00:00'), selectedDate))
    : needs.filter(n => new Date(n.date) >= new Date(new Date().toISOString().split('T')[0])).slice(0, 10);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Serve Together</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Give Your <span className="italic">Time</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Volunteering is how we live out our faith. Browse our calendar, find an opportunity 
              that fits your schedule, and sign up to make a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calendar + Needs */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VolunteerCalendar 
                needs={needs} 
                onSelectDate={setSelectedDate} 
                selectedDate={selectedDate}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl text-primary">
                  {selectedDate 
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Upcoming Needs'
                  }
                </h3>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="font-body text-xs text-accent hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>

              {filteredNeeds.length > 0 ? (
                <div className="space-y-4">
                  {filteredNeeds.map(need => (
                    <NeedCard 
                      key={need.id} 
                      need={need} 
                      onSignup={() => queryClient.invalidateQueries({ queryKey: ['volunteerNeeds'] })}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-border/50">
                  <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="font-body text-muted-foreground text-sm">
                    {selectedDate ? 'No volunteer needs for this date.' : 'No upcoming volunteer needs.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}