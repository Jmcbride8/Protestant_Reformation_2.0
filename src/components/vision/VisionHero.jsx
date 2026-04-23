import React from 'react';
import { motion } from 'framer-motion';
import EditableText from './EditableText';

export default function VisionHero({ isAdmin }) {
  return (
    <section className="relative pt-40 pb-24 px-4 overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(38 45% 60%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(38 45% 60%) 0%, transparent 40%)`
        }}
      />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-4"
        >
          Design Intent & Philosophy
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl md:text-6xl text-white mb-6 leading-tight"
        >
          Relationships First.
          <br />
          <span className="italic text-accent">Always.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EditableText
            storageKey="hero_subtitle"
            defaultText="A vision for a church website that moves beyond broadcasting information to cultivating genuine, lasting human connection — at any scale."
            className="font-body text-lg text-white/75 max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>
      </div>
    </section>
  );
}