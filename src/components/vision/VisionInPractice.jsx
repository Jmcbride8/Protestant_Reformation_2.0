import React from 'react';
import { motion } from 'framer-motion';
import { Car, HandHeart, Calendar, Users, MessageSquare, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Car,
    title: 'Carpool Coordination',
    description: 'Members offer and request rides to services — a small act that removes real barriers to attendance and opens a door for friendship.',
  },
  {
    icon: HandHeart,
    title: 'Community Support Board',
    description: 'A living board where members post needs and offers: meals, childcare, prayer, financial help, skills. The church as a mutual aid network.',
  },
  {
    icon: Users,
    title: 'Group Directories',
    description: 'Community groups are visible, searchable, and led by real people with bios. Members find their people — not just a program.',
  },
  {
    icon: Calendar,
    title: 'Volunteer Coordination',
    description: 'Specific needs, specific dates, specific roles. Members see exactly where they\'re needed and sign up in seconds.',
  },
  {
    icon: HeartHandshake,
    title: 'Life Milestones',
    description: 'Baptism, marriage, new families — the church acknowledges and walks with members through every sacred season of life.',
  },
  {
    icon: MessageSquare,
    title: 'Pastoral Contact',
    description: 'A simple, categorized form for reaching out about counseling, prayer, grief support — reducing the friction of asking for help.',
  },
];

export default function VisionInPractice() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Design in Practice</p>
          <h2 className="font-heading text-4xl text-primary mb-5">
            Philosophy Made Functional
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every feature on this site was designed with one question in mind:
            <em> "Does this help members connect with each other — or does it just broadcast information at them?"</em>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading text-lg text-primary mb-2">{feature.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}