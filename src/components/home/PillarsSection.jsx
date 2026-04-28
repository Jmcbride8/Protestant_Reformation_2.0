import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, HandHeart } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

const pillars = [
  {
    icon: Heart,
    num: '01',
    title: "FAITH",
    subtitle: "Something to believe in",
    description: "Not a set of rules — a relationship. We ask hard questions, sit with doubt, and find something worth anchoring to.",
    verse: "\"Love the Lord your God with all your heart and with all your soul and with all your mind.\" — Matthew 22:37",
  },
  {
    icon: Users,
    num: '02',
    title: "FAMILY",
    subtitle: "The most important structure God ever made",
    description: "Family is the foundation God designed for human flourishing. For those without one, the church exists to be that family — where no one sits alone, no one walks through hard seasons unaccompanied.",
    verse: "\"God sets the lonely in families.\" — Psalm 68:6",
  },
  {
    icon: HandHeart,
    num: '03',
    title: "FRIENDSHIPS",
    subtitle: "People who actually show up",
    description: "In a world of screens and scrolling, real connection has never been harder — or more needed. The kind of friends who know your name, notice when you're gone, and speak truth into your life.",
    verse: "\"As iron sharpens iron, so one person sharpens another.\" — Proverbs 27:17",
  }
];

export default function PillarsSection({ images, isAdmin }) {
  return (
    <section className="py-32 bg-background relative">
      <div className="absolute inset-0 grid-overlay opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-accent" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-accent">Core Pillars</span>
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl text-foreground mb-6 tracking-tight">THREE PILLARS<br />OF HOPE</h2>
          <div className="h-px w-full bg-white/5 mb-6" />
          <p className="font-mono text-sm text-foreground/30 max-w-xl leading-relaxed">
            // "Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself." — Matthew 22:37–39
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-0">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isReversed = index % 2 !== 0;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 border-t border-white/8`}
              >
                {/* Image side */}
                <div className={`relative overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[320px] ${isReversed ? 'lg:order-2' : ''}`}>
                  <EditableImage
                    imageKey={`pillar_${pillar.title.toLowerCase()}`}
                    src={images[index]}
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                    isAdmin={isAdmin}
                    wrapperClassName="absolute inset-0 group/editimg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {/* Number overlay */}
                  <div className="absolute bottom-6 left-6 font-mono text-7xl font-bold text-white/5 leading-none select-none">
                    {pillar.num}
                  </div>
                </div>

                {/* Text side */}
                <div className={`relative p-10 lg:p-16 flex flex-col justify-center bg-card border-l border-white/5 ${isReversed ? 'lg:order-1 border-r border-l-0' : ''}`}>
                  {/* Number + icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-4xl text-accent/20 font-bold">{pillar.num}</span>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="p-2 border border-accent/20 text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-3">{pillar.subtitle}</p>
                  <h3 className="font-heading text-4xl text-foreground mb-6 tracking-tight">{pillar.title}</h3>
                  <p className="font-body text-foreground/50 leading-relaxed mb-8">
                    {pillar.description}
                  </p>
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-xs text-foreground/40 leading-relaxed italic">
                      {pillar.verse}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}