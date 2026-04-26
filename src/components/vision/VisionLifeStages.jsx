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
            defaultText="The Christian life is a journey — marked by sacred moments. Weddings, newborns, losses, health crises — these are when people truly grow, when the church matters most, when faith deepens. This platform exists to help you be present, engaged, and memorable at every milestone."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Milestone Timeline */}
        <MilestoneTimeline isAdmin={isAdmin} />
      </div>
    </section>
  );
}