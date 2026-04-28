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
    numeral: "I",
  },
  {
    icon: Users,
    title: "Family",
    subtitle: "The most important structure God ever made",
    description: "Family is the foundation God designed for human flourishing — the place where love is first learned and life is most fully lived. For those without one, or far from their own, the church exists to be that family. A place where no one sits alone, no one walks through hard seasons unaccompanied, and everyone has a table to come home to.",
    verse: "\"God sets the lonely in families.\" — Psalm 68:6",
    numeral: "II",
  },
  {
    icon: HandHeart,
    title: "Friendships",
    subtitle: "People who actually show up",
    description: "In a world of screens and scrolling, real connection has never been harder — or more needed. The kind of friends who know your name, notice when you're gone, and speak truth into your life. We weren't made to do this alone.",
    verse: "\"As iron sharpens iron, so one person sharpens another.\" — Proverbs 27:17",
    numeral: "III",
  }
];

function CrossDivider() {
  return (
    <div className="flex items-center gap-4 my-16">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c8922a]/40" />
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#c8922a]/70 shrink-0" fill="currentColor">
        <rect x="10" y="1" width="4" height="22" rx="1"/>
        <rect x="1" y="9" width="22" height="4" rx="1"/>
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c8922a]/40" />
    </div>
  );
}

export default function PillarsSection({ images, isAdmin }) {
  return (
    <section className="py-24 bg-background parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-ui text-xs tracking-[0.4em] uppercase text-[#c8922a] mb-4">Our Foundation</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6 tracking-wide">
            Three Pillars of Hope
          </h2>
          {/* Decorative rule with cross */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#c8922a]/60" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#c8922a]/80" fill="currentColor">
              <rect x="10" y="1" width="4" height="22" rx="1"/>
              <rect x="1" y="9" width="22" height="4" rx="1"/>
            </svg>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#c8922a]/60" />
          </div>
          <blockquote className="font-body text-xl italic text-primary/70 max-w-2xl mx-auto leading-relaxed">
            "Love the Lord your God with all your heart and with all your soul and with all your mind. 
            This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself."
            <span className="block font-ui text-xs not-italic text-[#c8922a] mt-3 tracking-widest uppercase">— Matthew 22:37–39</span>
          </blockquote>
        </motion.div>

        <div className="space-y-0">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isReversed = index % 2 !== 0;
            return (
              <div key={pillar.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch`}
                >
                  {/* Image side */}
                  <div className={`${isReversed ? 'lg:order-2' : ''} relative overflow-hidden min-h-[420px]`}>
                    <EditableImage
                      imageKey={`pillar_${pillar.title.toLowerCase()}`}
                      src={images[index]}
                      alt={pillar.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      isAdmin={isAdmin}
                      wrapperClassName="absolute inset-0 group/editimg"
                    />
                    {/* Crusader red tint overlay */}
                    <div className={`absolute inset-0 ${isReversed ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#1a0a08]/50 via-transparent to-transparent`} />
                    {/* Large roman numeral watermark */}
                    <div className="absolute bottom-6 right-6 font-heading text-8xl font-black text-white/10 select-none leading-none">
                      {pillar.numeral}
                    </div>
                  </div>

                  {/* Text side */}
                  <div className={`${isReversed ? 'lg:order-1' : ''} bg-[#1a0a08] px-10 py-16 flex flex-col justify-center`}>
                    {/* Gold top rule */}
                    <div className="w-12 h-0.5 bg-[#c8922a] mb-8" />

                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-5 h-5 text-[#c8922a]" />
                      <span className="font-ui text-xs tracking-[0.3em] uppercase text-[#c8922a]/80">{pillar.subtitle}</span>
                    </div>
                    <h3 className="font-heading text-5xl text-white mb-6 tracking-wide">{pillar.title}</h3>
                    <p className="font-body text-white/75 leading-relaxed text-lg mb-8">
                      {pillar.description}
                    </p>
                    <blockquote className="border-l-2 border-[#c8922a]/60 pl-5 italic font-body text-white/60 text-base">
                      {pillar.verse}
                    </blockquote>
                  </div>
                </motion.div>
                {index < pillars.length - 1 && <CrossDivider />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}