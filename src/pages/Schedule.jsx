import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Cross, UtensilsCrossed, BookOpen, HeartHandshake } from 'lucide-react';

const weeklySchedule = [
  { day: "Sunday", time: "9:00 & 11:00 AM", event: "Worship Services", icon: Cross },
  { day: "Wednesday", time: "6:00 PM", event: "Community Dinner (at cost)", icon: UtensilsCrossed },
  { day: "Wednesday", time: "7:00 PM", event: "Midweek Study & Prayer", icon: BookOpen },
  { day: "Saturday", time: "8:00 AM", event: "Men's & Women's Groups", icon: HeartHandshake },
];

export default function Schedule() {
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

      {/* Schedule */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {weeklySchedule.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-lg">{item.event}</h4>
                    <p className="font-body text-sm text-primary-foreground/60">{item.day}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span className="font-body text-sm">{item.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12 flex items-center justify-center gap-2 text-primary-foreground/60">
            <MapPin className="w-4 h-4" />
            <span className="font-body text-sm">123 Hope Street, Santa Barbara, CA 93101</span>
          </div>
        </div>
      </section>
    </div>
  );
}