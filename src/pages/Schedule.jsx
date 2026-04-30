import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Cross, UtensilsCrossed, BookOpen, HeartHandshake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ChurchCalendar from '@/components/schedule/ChurchCalendar';

const iconMap = {
  Cross, UtensilsCrossed, BookOpen, HeartHandshake
};

export default function Schedule() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    });
  }, []);

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['scheduleItems'],
    queryFn: () => base44.entities.ScheduleItem.list('sort_order', 50),
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Join Us</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Weekly <span className="italic">Schedule</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We gather every week to worship, serve, and build community together. Find a time that works for you and join us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Weekly Recurring Schedule */}
      <section className="py-16 bg-secondary/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-2">Every Week</p>
            <h2 className="font-heading text-3xl text-primary">Regular Gatherings</h2>
          </motion.div>
          <div className="space-y-4">
            {scheduleItems.filter(item => item.is_active !== false).map((item, index) => {
              const Icon = iconMap[item.icon_name];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-xl bg-card border border-border/60 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                    {Icon && <Icon className="w-6 h-6 text-accent" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-lg text-primary">{item.event}</h4>
                    <p className="font-body text-sm text-muted-foreground">{item.day}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-body text-sm">{item.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/50 mb-2">Upcoming</p>
            <h2 className="font-heading text-3xl text-primary-foreground">Church Calendar</h2>
          </motion.div>
          <ChurchCalendar user={user} />
        </div>
      </section>
    </div>
  );
}