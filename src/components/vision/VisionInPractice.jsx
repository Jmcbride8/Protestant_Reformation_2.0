import React from 'react';
import { motion } from 'framer-motion';
import { Car, HandHeart, Calendar, Users, HeartHandshake, MessageSquare, Coins, ShieldCheck } from 'lucide-react';
import EditableText from './EditableText';

const everydayLifeFeatures = [
  {
    icon: MessageSquare,
    title: 'Memories',
    descKey: 'practice_memories',
    defaultDesc: 'Members share moments — baptisms, milestones, gatherings. A living record of life together. Not broadcast. Moments to remember.',
  },
  {
    icon: Car,
    title: 'Carpool Coordination',
    descKey: 'practice_carpool',
    defaultDesc: 'Members offer and request rides. A simple act that removes real barriers and opens doors for friendship.',
  },
  {
    icon: HandHeart,
    title: 'Community Support Board',
    descKey: 'practice_support',
    defaultDesc: 'Members post needs and offers: meals, childcare, prayer. Neighbors caring for neighbors in real time.',
  },
  {
    icon: Calendar,
    title: 'Volunteer & Events',
    descKey: 'practice_volunteer',
    defaultDesc: 'Specific needs, real dates, real people. Members see where they can show up and sign up in seconds.',
  },
  {
    icon: HeartHandshake,
    title: 'Life Milestones',
    descKey: 'practice_milestones',
    defaultDesc: 'The church walks with members through baptism, marriage, new families — every sacred season of life.',
  },
  {
    icon: MessageSquare,
    title: 'Pastoral Contact',
    descKey: 'practice_contact',
    defaultDesc: 'A simple form for reaching out about counseling, prayer, grief support — reducing friction in asking for help.',
  },
];

const programmingFeatures = [
  {
    icon: Users,
    title: 'Groups & Classes',
    descKey: 'practice_programming_groups',
    defaultDesc: 'Sunday services, small groups, classes, and ministries — all coordinated on the platform so members can find where they belong.',
  },
  {
    icon: Calendar,
    title: 'Events & Engagement',
    descKey: 'practice_programming_events',
    defaultDesc: 'From Sunday worship to midweek Bible studies, mission trips to serve days — the full rhythm of church life, all visible and accessible.',
  },
  {
    icon: Users,
    title: 'Beyond Sunday',
    descKey: 'practice_programming_beyond',
    defaultDesc: 'Programming that extends the Sunday experience — weeknight gatherings, prayer, mentorship, spiritual formation. A living, active community.',
  },
];

const groupFeatures = [
  {
    icon: Users,
    title: 'Group Directories & Leadership',
    descKey: 'practice_groups',
    defaultDesc: 'Groups are led by real people with real stories. Members find their people — not just a program to attend. Each group has its own identity, leader, and space.',
  },
  {
    icon: Coins,
    title: 'Group Finances',
    descKey: 'practice_finances',
    defaultDesc: 'Groups hold their own funds — contributed by members, managed by leaders. They can directly finance individual needs within the group or fuel shared events. Money pooled together creates shared stakes and shared stories.',
  },
  {
    icon: ShieldCheck,
    title: 'Peer-to-Peer & Group Giving',
    descKey: 'practice_autonomy',
    defaultDesc: 'Members can give directly to each other\'s posted needs — no intermediary required. Or contribute to a shared group pool that leaders deploy for events and care. Three modes: church, group, and person-to-person.',
  },
];

export default function VisionInPractice({ isAdmin }) {
  return (
    <section className="pt-24 pb-0 bg-background w-screen relative left-[calc(-50vw+50%)]">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Design in Practice</p>
          <h2 className="font-heading text-4xl text-primary mb-5">Philosophy Made Functional</h2>
          <EditableText
            storageKey="practice_intro"
            defaultText='Every feature was designed with one question: "Does this help members connect with each other — or does it just broadcast information at them?"'
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Groups — the core innovation — prominent full-width block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary/95 rounded-3xl p-12 mb-0 overflow-hidden relative shadow-xl mx-[-1000px] px-[1000px]"
        >
          {/* Watermark */}
          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-heading text-[10rem] leading-none text-white/5 select-none pointer-events-none">Groups</span>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent/90 mb-3 font-medium">The Core Innovation</p>
              <h3 className="font-heading text-4xl text-white mb-6 leading-tight">Groups with Independent Power</h3>
              <p className="font-body text-lg text-white/75 leading-relaxed mb-6">
                The church is the platform. Groups are the family. Each group has its own leadership, its own tools — and most importantly, its own finances. Members contribute directly to a group pool, leaders deploy those funds toward individual needs or shared events.
              </p>
              <blockquote className="bg-white/8 border-l-3 border-accent rounded-r-lg pl-6 pr-6 py-5 my-6">
                <p className="font-heading text-lg italic text-white/90 mb-2">"Where your treasure is, there your heart will be also."</p>
                <p className="font-body text-xs text-accent/80 font-medium">— Matthew 6:21</p>
              </blockquote>
              <p className="font-body text-white/65 leading-relaxed max-w-2xl">
                Financial commitment creates emotional commitment. When you've given to someone's need — or received from a group that showed up for you — you're no longer an audience member. You're family.
              </p>
            </div>

            {/* Giving Modes Illustration */}
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/60 mb-5">Three Modes of Giving</p>
              <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden w-full mb-8">

                {/* Mode 1: Church Only */}
                <div className="p-6 text-center flex flex-col items-center justify-start">
                  <p className="font-body text-xs text-white/40 uppercase tracking-widest mb-4">Traditional</p>
                  <svg viewBox="0 0 100 90" className="w-24 h-24" fill="none">
                    {/* Church building */}
                    <rect x="35" y="20" width="30" height="28" rx="2" fill="currentColor" className="text-accent/40" />
                    <polygon points="50,8 30,22 70,22" fill="currentColor" className="text-accent/60" />
                    {/* Arrow down to people */}
                    <line x1="50" y1="50" x2="50" y2="62" stroke="currentColor" strokeWidth="1.5" className="text-accent/50" />
                    <polygon points="50,66 47,61 53,61" fill="currentColor" className="text-accent/50" />
                    {/* People row */}
                    {[20, 35, 50, 65, 80].map((x, i) => (
                      <g key={i}>
                        <circle cx={x} cy="74" r="5" fill="currentColor" className="text-white/20" />
                        <rect x={x - 4} y="80" width="8" height="7" rx="2" fill="currentColor" className="text-white/15" />
                      </g>
                    ))}
                  </svg>
                  <p className="font-body text-xs text-white/50 mt-3 leading-snug">Church → Congregation</p>
                  <p className="font-body text-[10px] text-white/30 mt-1 leading-snug">One-directional. Broadcast.</p>
                </div>

                {/* Mode 2: Groups */}
                <div className="p-6 text-center flex flex-col items-center justify-start">
                  <p className="font-body text-xs text-accent/80 uppercase tracking-widest mb-4">Groups</p>
                  <svg viewBox="0 0 100 90" className="w-24 h-24" fill="none">
                    {/* Church at top */}
                    <rect x="38" y="4" width="24" height="16" rx="2" fill="currentColor" className="text-accent/30" />
                    <polygon points="50,0 36,6 64,6" fill="currentColor" className="text-accent/50" />
                    {/* Arrow to group circles */}
                    <line x1="30" y1="22" x2="20" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-white/20" />
                    <line x1="50" y1="22" x2="50" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-white/20" />
                    <line x1="70" y1="22" x2="80" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-white/20" />
                    {/* Three group clusters */}
                    {[
                      { cx: 20, cy: 50, members: [[10,44],[20,42],[30,44],[14,56],[26,56]] },
                      { cx: 50, cy: 50, members: [[40,44],[50,42],[60,44],[44,56],[56,56]] },
                      { cx: 80, cy: 50, members: [[70,44],[80,42],[90,44],[74,56],[86,56]] },
                    ].map((g, gi) => (
                      <g key={gi}>
                        {g.members.map(([mx, my], mi) => (
                          <circle key={mi} cx={mx} cy={my} r="4" fill="currentColor" className="text-accent/50" />
                        ))}
                        {/* pool coin */}
                        <circle cx={g.cx} cy={72} r="6" fill="currentColor" className="text-accent/30" />
                        <text x={g.cx} y={75} textAnchor="middle" fontSize="6" fill="currentColor" className="text-accent">$</text>
                      </g>
                    ))}
                  </svg>
                  <p className="font-body text-xs text-white/60 mt-3 leading-snug">Church → Groups → Members</p>
                  <p className="font-body text-[10px] text-accent/60 mt-1 leading-snug">Shared pool. Leader-deployed.</p>
                </div>

                {/* Mode 3: Peer-to-Peer */}
                <div className="p-6 text-center flex flex-col items-center justify-start">
                  <p className="font-body text-xs text-white/40 uppercase tracking-widest mb-4">Peer-to-Peer</p>
                  <svg viewBox="0 0 100 90" className="w-24 h-24" fill="none">
                    {/* People constellation with mutual arrows */}
                    {[
                      { cx: 50, cy: 18 },
                      { cx: 82, cy: 40 },
                      { cx: 70, cy: 74 },
                      { cx: 30, cy: 74 },
                      { cx: 18, cy: 40 },
                    ].map((p, pi, arr) => {
                      const next = arr[(pi + 1) % arr.length];
                      const skip = arr[(pi + 2) % arr.length];
                      return (
                        <g key={pi}>
                          <line x1={p.cx} y1={p.cy} x2={next.cx} y2={next.cy} stroke="currentColor" strokeWidth="0.8" className="text-accent/25" />
                          <line x1={p.cx} y1={p.cy} x2={skip.cx} y2={skip.cy} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-white/10" />
                        </g>
                      );
                    })}
                    {[
                      { cx: 50, cy: 18 },
                      { cx: 82, cy: 40 },
                      { cx: 70, cy: 74 },
                      { cx: 30, cy: 74 },
                      { cx: 18, cy: 40 },
                    ].map((p, pi) => (
                      <circle key={pi} cx={p.cx} cy={p.cy} r="7" fill="currentColor" className="text-white/30" />
                    ))}
                    {/* heart in center */}
                    <text x="50" y="50" textAnchor="middle" fontSize="12" fill="currentColor" className="text-accent/70">♥</text>
                  </svg>
                  <p className="font-body text-xs text-white/50 mt-3 leading-snug">Member → Member</p>
                  <p className="font-body text-[10px] text-white/30 mt-1 leading-snug">Direct. No intermediary.</p>
                </div>

              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 divide-x divide-white/10">
              {groupFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative h-full p-6 overflow-hidden"
                  style={{ paddingLeft: i === 0 ? '0' : 'undefined' }}
                >
                  {/* Roman numeral watermark */}
                  <span className="absolute top-4 right-5 font-heading text-3xl font-bold text-white/8 select-none pointer-events-none">
                    {['I', 'II', 'III'][i]}
                  </span>

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-accent/25 border border-accent/30 flex items-center justify-center mb-5">
                      <f.icon className="w-5 h-5 text-accent/80" />
                    </div>
                    <h4 className="font-heading text-lg text-white mb-3 leading-tight pr-6">{f.title}</h4>
                    <EditableText
                      storageKey={f.descKey}
                      defaultText={f.defaultDesc}
                      className="font-body text-sm text-white/65 leading-relaxed"
                      isAdmin={isAdmin}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Second Innovation: Church Platform — Everyday Life */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-secondary/40 rounded-none p-12 mb-0 overflow-hidden mx-[-1000px] px-[1000px]"
         >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-3 font-medium">The Second Innovation</p>
              <h3 className="font-heading text-3xl text-primary mb-5">A Platform for Everyday Life</h3>
              <EditableText
                storageKey="practice_platform_intro"
                defaultText='Groups need tools. Members need connection. The platform keeps life practical and alive — not with broadcasts, but with moments to share, needs to meet, and rides to coordinate.'
                className="font-body text-muted-foreground leading-relaxed"
                isAdmin={isAdmin}
              />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {everydayLifeFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="font-heading text-lg text-primary mb-2">{feature.title}</h4>
                  <EditableText
                    storageKey={feature.descKey}
                    defaultText={feature.defaultDesc}
                    className="font-body text-sm text-muted-foreground leading-relaxed"
                    isAdmin={isAdmin}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>



      </div>
    </section>
  );
}