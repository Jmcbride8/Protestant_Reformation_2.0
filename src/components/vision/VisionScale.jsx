import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown } from 'lucide-react';
import EditableText from './EditableText';

const levels = [
  {
    label: 'The Church',
    descKey: 'scale_level_church',
    defaultDesc: 'Sets vision, hosts worship, provides pastoral leadership and doctrinal grounding.',
    color: 'bg-primary text-primary-foreground',
    border: 'border-primary',
  },
  {
    label: 'Community Groups',
    descKey: 'scale_level_groups',
    defaultDesc: 'The heart of daily relational life. Groups meet locally, carry one another\'s burdens, and mobilize care.',
    color: 'bg-accent/20 text-accent-foreground',
    border: 'border-accent',
  },
  {
    label: 'Individual Members',
    descKey: 'scale_level_members',
    defaultDesc: 'People caring for people — offering rides, meals, a listening ear, prayer, and presence to one another.',
    color: 'bg-secondary text-secondary-foreground',
    border: 'border-border',
  },
];

export default function VisionScale({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-muted/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Scaling for Small Churches</p>
          <h2 className="font-heading text-4xl text-primary mb-5">A Church That Carries Its Own Weight — Together</h2>
          <EditableText
            storageKey="scale_intro"
            defaultText="This model is especially well suited to small churches with lean teams and stretched staff — where the pastor cannot be everywhere at once, and was never meant to be. When members are genuinely connected to one another, the family carries each other."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Federated levels diagram */}
        <div className="flex flex-col items-center gap-3 mb-16">
          {levels.map((level, i) => (
            <React.Fragment key={level.label}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`w-full max-w-lg border-2 ${level.border} rounded-2xl p-5 text-center`}
                style={{ maxWidth: `${520 - i * 60}px` }}
              >
                <p className={`font-heading text-lg mb-1 ${i === 0 ? 'text-white bg-primary rounded-xl px-3 py-1 inline-block mb-2' : 'text-primary'}`}>
                  {level.label}
                </p>
                <EditableText
                  storageKey={level.descKey}
                  defaultText={level.defaultDesc}
                  className="font-body text-sm text-muted-foreground leading-relaxed"
                  isAdmin={isAdmin}
                />
              </motion.div>
              {i < levels.length - 1 && (
                <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
              )}
            </React.Fragment>
          ))}
        </div>


      </div>
    </section>
  );
}