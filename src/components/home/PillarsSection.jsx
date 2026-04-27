import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, HandHeart } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

const pillars = [
  {
    icon: Heart,
    title: "Faith",
    subtitle: "Something to believe in",
    description: "Not a set of rules — a relationship. We ask hard questions, sit with doubt, and find something worth anchoring to.",
    verse: "\"Love the Lord your God with all your heart and with all your soul and with all your mind.\" — Matthew 22:37",
  },
  {
    icon: Users,
    title: "Family",
    subtitle: "Every stage, every season",
    description: "Whether you're raising kids, flying solo, or somewhere in between — you belong here. No perfect family required.",
    verse: "\"As for me and my house, we will serve the Lord.\" — Joshua 24:15",
  },
  {
    icon: HandHeart,
    title: "Friendships",
    subtitle: "People who actually show up",
    description: "The kind of friends who know your name, notice when you're gone, and show up when life gets hard. That's what we're building.",
    verse: "\"Love your neighbor as yourself.\" — Matthew 22:39",
  }
];

export default function PillarsSection({ images, isAdmin }) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-1">Our Foundation</p>
          <div className="flex items-center justify-center gap-8 mb-2">
            <h2 className="font-heading text-4xl sm:text-5xl text-primary">Three Pillars of Hope</h2>
          </div>
          <blockquote className="font-heading text-xl italic text-primary/70 max-w-2xl mx-auto leading-relaxed mb-6">
            "Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself."
            <span className="block font-body text-sm not-italic text-accent mt-2">— Matthew 22:37–39</span>
          </blockquote>
        </motion.div>

        <div className="space-y-24">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isReversed = index % 2 !== 0;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`${isReversed ? 'lg:order-2' : ''}`}>
                  <EditableImage
                    imageKey={`pillar_${pillar.title.toLowerCase()}`}
                    src={images[index]}
                    alt={pillar.title}
                    className="w-full h-full object-cover"
                    isAdmin={isAdmin}
                    wrapperClassName="relative overflow-hidden rounded-2xl aspect-[4/3] group/editimg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                </div>
                <div className={`${isReversed ? 'lg:order-1' : ''} space-y-6`}>
                  <div className="inline-flex items-center gap-3 bg-secondary/60 rounded-full px-4 py-2">
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="font-body text-sm tracking-wide text-primary font-medium">{pillar.subtitle}</span>
                  </div>
                  <h3 className="font-heading text-4xl text-primary">{pillar.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed text-lg">
                    {pillar.description}
                  </p>
                  <blockquote className="border-l-2 border-accent pl-4 italic font-heading text-primary/70">
                    {pillar.verse}
                  </blockquote>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}