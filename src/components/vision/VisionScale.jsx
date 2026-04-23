import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown, Building2 } from 'lucide-react';

const levels = [
  {
    label: 'The Church',
    description: 'Sets vision, hosts worship, provides pastoral leadership and doctrinal grounding.',
    color: 'bg-primary text-primary-foreground',
    border: 'border-primary',
  },
  {
    label: 'Community Groups',
    description: 'The heart of daily relational life. Groups meet locally, carry one another\'s burdens, and mobilize care.',
    color: 'bg-accent/20 text-accent-foreground',
    border: 'border-accent',
  },
  {
    label: 'Individual Members',
    description: 'Empowered contributors — offering rides, meals, skills, prayer, and presence to one another.',
    color: 'bg-secondary text-secondary-foreground',
    border: 'border-border',
  },
];

export default function VisionScale() {
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
          <h2 className="font-heading text-4xl text-primary mb-5">
            A Relational Marketplace, Not a Pyramid
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This model is especially suited to small churches with lean teams and tight budgets —
            where the pastor can't do everything, and shouldn't have to. By connecting members with each other,
            the community itself becomes the resource.
          </p>
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
                <p className={`font-heading text-lg mb-1 ${i === 0 ? 'text-white' : 'text-primary'} ${i === 0 ? 'bg-primary rounded-xl px-3 py-1 inline-block mb-2' : ''}`}>
                  {level.label}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {level.description}
                </p>
              </motion.div>
              {i < levels.length - 1 && (
                <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Key insight callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
        >
          <Heart className="w-8 h-8 text-accent mx-auto mb-4" />
          <h3 className="font-heading text-2xl text-primary mb-3">
            "The church is not the building. It's not even the Sunday service.<br />
            <span className="italic">It's the people, caring for each other, all week long."</span>
          </h3>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
            This site is built to make that vision tangible — not just aspirational.
            Every feature exists to lower the barrier for members to connect, serve, and belong.
          </p>
        </motion.div>
      </div>
    </section>
  );
}