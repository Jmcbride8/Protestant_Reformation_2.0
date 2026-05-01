import React from 'react';
import { motion } from 'framer-motion';
import { Car, HandHeart, Calendar, Users, HeartHandshake, MessageSquare, Coins, ShieldCheck } from 'lucide-react';
import EditableText from './EditableText';

const platformFeatures = [
  {
    icon: Car,
    title: 'Carpool Coordination',
    descKey: 'practice_carpool',
    defaultDesc: 'Members offer and request rides to services — a small act that removes real barriers to attendance and opens a door for friendship.',
  },
  {
    icon: HandHeart,
    title: 'Community Support Board',
    descKey: 'practice_support',
    defaultDesc: 'A living board where members post needs and offers: meals, childcare, prayer, a helping hand. Neighbors caring for neighbors.',
  },
  {
    icon: Calendar,
    title: 'Volunteer & Events',
    descKey: 'practice_volunteer',
    defaultDesc: 'Specific needs, real dates, real people. Members see where they can show up and make it happen in seconds.',
  },
  {
    icon: HeartHandshake,
    title: 'Life Milestones',
    descKey: 'practice_milestones',
    defaultDesc: 'Baptism, marriage, new families — the church acknowledges and walks with members through every sacred season of life.',
  },
  {
    icon: MessageSquare,
    title: 'Pastoral Contact',
    descKey: 'practice_contact',
    defaultDesc: 'A simple, categorized form for reaching out about counseling, prayer, grief support — reducing the friction of asking for help.',
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
    title: 'Group Autonomy',
    descKey: 'practice_autonomy',
    defaultDesc: 'Each group can organize, communicate, and act independently — without waiting for top-down approval. The church is the platform. The group is the family.',
  },
];

export default function VisionInPractice({ isAdmin }) {
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
          className="bg-primary rounded-3xl p-10 mb-6 overflow-hidden relative"
        >
          {/* Watermark */}
          <span className="absolute right-8 bottom-4 font-heading text-[7rem] leading-none text-white/4 select-none pointer-events-none">Groups</span>

          <div className="relative z-10">
            <div className="mb-8">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-2">The Core Innovation</p>
              <h3 className="font-heading text-3xl text-white mb-4">Groups with Independent Power</h3>
              <p className="font-body text-white/70 leading-relaxed max-w-2xl">
                The church is the platform. Groups are the family. Each group has its own leadership, its own tools — and most importantly, its own finances. Members contribute directly to a group pool, leaders deploy those funds toward individual needs or shared events.
              </p>
              <blockquote className="mt-5 border-l-2 border-accent pl-5">
                <p className="font-heading text-lg italic text-white/80">"Where your treasure is, there your heart will be also."</p>
                <p className="font-body text-xs text-accent mt-1">— Matthew 6:21</p>
              </blockquote>
              <p className="font-body text-white/60 text-sm mt-4 leading-relaxed max-w-xl">
                Financial commitment creates emotional commitment. When you've given to someone's need — or received from a group that showed up for you — you're no longer an audience member. You're family.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {groupFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/8 border border-white/10 rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="font-heading text-base text-white mb-2">{f.title}</h4>
                  <EditableText
                    storageKey={f.descKey}
                    defaultText={f.defaultDesc}
                    className="font-body text-sm text-white/60 leading-relaxed"
                    isAdmin={isAdmin}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Church platform features — supporting grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 pl-1">The Church Platform</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading text-lg text-primary mb-2">{feature.title}</h3>
                <EditableText
                  storageKey={feature.descKey}
                  defaultText={feature.defaultDesc}
                  className="font-body text-sm text-muted-foreground leading-relaxed"
                  isAdmin={isAdmin}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}