import React from 'react';
import { motion } from 'framer-motion';
import EditableText from './EditableText';
import MilestoneTimeline from './MilestoneTimeline';

export default function VisionLifeStages({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Christian Life Stages</p>
          <h2 className="font-heading text-4xl text-primary mb-5">Living with Intentionality</h2>
          <EditableText
            storageKey="lifecycle_intro"
            defaultText="Faith is a journey, not a Sunday destination. Life's biggest moments — births, weddings, losses — are when people truly grow. Are we there for them? This platform helps churches walk alongside members through every milestone, turning moments of change into deeper faith and lasting community."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Milestone Timeline */}
        <MilestoneTimeline isAdmin={isAdmin} />

        {/* Core conviction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary rounded-2xl p-10 text-center text-primary-foreground"
        >
          <p className="font-body text-xs tracking-widest uppercase mb-4 text-primary-foreground/70">Our Conviction</p>
          <EditableText
            storageKey="lifecycle_conviction"
            defaultText="The Christian life is a journey. Weddings, newborns, grief, health crises — these sacred moments are when people need the church most. This platform helps you be present, engaged, and memorable through every season of life."
            className="font-body text-lg leading-relaxed italic"
            isAdmin={isAdmin}
          />
        </motion.div>
      </div>
    </section>
  );
}