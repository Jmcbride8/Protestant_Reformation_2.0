import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Network, Heart, Users, ArrowRight } from 'lucide-react';
import EditableText from './EditableText';

const verses = [
  { text: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer… And the Lord added to their number daily those who were being saved.", ref: "Acts 2:42, 47" },
  { text: "From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work.", ref: "Ephesians 4:16" },
];

// SVG illustration: rows of seats pointing at a stage
function RowsIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-28" fill="none">
      {/* Stage / speaker */}
      <rect x="60" y="8" width="40" height="10" rx="3" fill="currentColor" className="text-primary/25" />
      <circle cx="80" cy="8" r="4" fill="currentColor" className="text-primary/40" />
      {/* Rows */}
      {[38, 58, 78, 98].map((y, ri) => (
        <g key={ri}>
          {Array.from({ length: 7 + ri }).map((_, i) => {
            const total = 7 + ri;
            const x = 80 - (total * 16) / 2 + i * 16 + 4;
            return <rect key={i} x={x} y={y} width="10" height="9" rx="2" fill="currentColor" className="text-primary/20" />;
          })}
        </g>
      ))}
      {/* Arrow pointing forward */}
      <line x1="80" y1="105" x2="80" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-border" />
      <polygon points="80,14 77,21 83,21" fill="currentColor" className="text-border" />
    </svg>
  );
}

// SVG illustration: several small circles of people
function CirclesIllustration() {
  const groups = [
    { cx: 45, cy: 42, members: 5 },
    { cx: 115, cy: 42, members: 4 },
    { cx: 80, cy: 88, members: 6 },
  ];
  return (
    <svg viewBox="0 0 160 120" className="w-full h-28" fill="none">
      {/* Connection lines between groups */}
      <line x1="45" y1="42" x2="115" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-accent/40" />
      <line x1="45" y1="42" x2="80" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-accent/40" />
      <line x1="115" y1="42" x2="80" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-accent/40" />
      {groups.map((g, gi) => {
        const r = 18;
        return (
          <g key={gi}>
            {/* center */}
            <circle cx={g.cx} cy={g.cy} r="4" fill="currentColor" className="text-accent/50" />
            {/* members */}
            {Array.from({ length: g.members }).map((_, i) => {
              const angle = (i / g.members) * 2 * Math.PI - Math.PI / 2;
              const mx = g.cx + r * Math.cos(angle);
              const my = g.cy + r * Math.sin(angle);
              return (
                <g key={i}>
                  <line x1={g.cx} y1={g.cy} x2={mx} y2={my} stroke="currentColor" strokeWidth="0.8" className="text-accent/30" />
                  <circle cx={mx} cy={my} r="5" fill="currentColor" className="text-accent" />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function VisionPhilosophy({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">The Philosophical Lineage</p>
          <h2 className="font-heading text-4xl text-primary mb-3">Growth <span className="italic">and</span> Family</h2>
          <div className="inline-block bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            The Protestant Reformation 2.0
          </div>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            God's vision for the church was never either/or. It was both: a movement that spread to every corner of the earth — and a family where every person was known. The question is how.
          </p>
        </motion.div>

        {/* Circles vs Rows — with headers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {/* Rows */}
          <div className="bg-muted/60 border border-border rounded-2xl p-7 text-center">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Church & Programs</p>
            <h3 className="font-heading text-xl text-primary mb-4">Rows</h3>
            <RowsIllustration />
            <p className="font-body text-xs text-muted-foreground mt-4 leading-relaxed">Audience. Passive. Anonymous.</p>
          </div>

          {/* Circles */}
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-7 text-center">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/70 mb-1">Groups & Relationships</p>
            <h3 className="font-heading text-xl text-primary mb-4">Circles</h3>
            <CirclesIllustration />
            <p className="font-body text-xs text-muted-foreground mt-4 leading-relaxed">Family. Known. Accountable.</p>
          </div>
        </motion.div>

        {/* We want both */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-heading text-2xl text-primary italic">We want both.</p>
        </motion.div>

        {/* Federation insight — full-width feature block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative bg-secondary/40 border border-border rounded-3xl p-10 mb-8 overflow-hidden"
        >
          <span className="absolute right-8 top-6 font-heading text-[8rem] leading-none text-border/60 select-none pointer-events-none">1787</span>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Network className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-accent">The Model</p>
                <h3 className="font-heading text-2xl text-primary leading-tight">Federalism — A Christian Innovation</h3>
              </div>
            </div>
            <EditableText
              storageKey="philosophy_federation"
              defaultText="The American federal system wasn't just a political invention — it was a theological one. Its architects, shaped by Calvinist and Reformed thinking, were deeply suspicious of concentrated power. Their solution: push authority and resources down to the local level. Let communities govern themselves. Keep decision-making close to the people it affects."
              className="font-body text-muted-foreground leading-relaxed mb-4"
              isAdmin={isAdmin}
            />
            <EditableText
              storageKey="philosophy_federation2"
              defaultText="The same instinct runs through the New Testament church. Not a centralized hierarchy issuing directives — but a network of local congregations, each led by elders, each caring for its own, each connected to something larger. Intimacy at the local level. Scale across the network."
              className="font-body text-muted-foreground leading-relaxed"
              isAdmin={isAdmin}
            />
          </div>
        </motion.div>

        {/* Two pillars — rich dark cards matching attached design */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-primary rounded-2xl p-8 flex flex-col overflow-hidden"
          >
            <span className="absolute top-6 right-7 font-heading text-5xl font-bold text-white/5 select-none pointer-events-none">I</span>
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-heading text-2xl text-white mb-3">Relationships at Every Size</h3>
            <EditableText
              storageKey="philosophy_roots"
              defaultText="The early church grew explosively — and stayed personal. Members knew each other's names, ate in each other's homes, and carried each other's burdens. Acts describes a community so visibly caring that it drew outsiders in. That wasn't despite their growth. It was how they grew."
              className="font-body text-white/70 leading-relaxed text-sm flex-1"
              isAdmin={isAdmin}
            />
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="font-body text-xs italic text-accent/80">"And the Lord added to their number daily those who were being saved." — Acts 2:47</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-primary/80 rounded-2xl p-8 flex flex-col overflow-hidden"
          >
            <span className="absolute top-6 right-7 font-heading text-5xl font-bold text-white/5 select-none pointer-events-none">II</span>
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-heading text-2xl text-white mb-3">Technology as Infrastructure</h3>
            <EditableText
              storageKey="philosophy_people"
              defaultText="We believed technology could play the same role federalism did — making local connection practical at any scale. Not replacing the meal, the conversation, the care. Making it easier to find, offer, and sustain. A platform that serves the circle, not the row."
              className="font-body text-white/70 leading-relaxed text-sm flex-1"
              isAdmin={isAdmin}
            />
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="font-body text-xs italic text-accent/80">"The whole body… grows and builds itself up in love, as each part does its work." — Ephesians 4:16</p>
            </div>
          </motion.div>
        </div>

        {/* WikiChurch reference — compact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 bg-muted/50 border border-border rounded-2xl px-7 py-5"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs tracking-widest uppercase text-accent mb-0.5">Foundational Reading</p>
            <p className="font-heading text-lg text-primary">WikiChurch — Steve Murrell</p>
            <p className="font-body text-sm text-muted-foreground mt-1">A church less like a lecture hall, more like a living, collaboratively built resource — where every member contributes.</p>
          </div>
          <a
            href="https://www.amazon.com/WikiChurch-Making-Discipleship-Engaging-Empowering/dp/1616384441"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}