import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cross, BookOpen, Heart, Globe, Users, Zap, Star, Flame, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const ICON_MAP = { BookOpen, Cross, Heart, Globe, Users, Zap, Star, Flame, Shield };


function BeliefAccordion({ belief, isOpen, onToggle, index }) {
  const Icon = ICON_MAP[belief.icon] || BookOpen;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-card'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-6 text-left"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-accent/15' : 'bg-secondary'}`}>
          <Icon className={`w-5 h-5 transition-colors ${isOpen ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-heading text-lg text-primary">{belief.title}</h4>
          <p className="font-body text-sm text-muted-foreground mt-0.5">{belief.summary}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-0 pl-20">
              <p className="font-body text-muted-foreground leading-relaxed text-sm">
                {belief.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BeliefsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const { data: beliefs = [] } = useQuery({
    queryKey: ['beliefs'],
    queryFn: () => base44.entities.Belief.list('sort_order', 50),
  });

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">What We Believe</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            Core Doctrinal Beliefs
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We hold to the historic Christian faith as summarized in the great creeds of the church. 
            These convictions aren't walls to keep people out — they're anchors that hold us steady 
            and unite us in truth and love.
          </p>
        </motion.div>

        <div className="space-y-3">
          {beliefs.map((belief, index) => (
            <BeliefAccordion
              key={belief.id}
              belief={belief}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="font-body text-sm text-muted-foreground">
            Have questions about what we believe?{' '}
            <a href="/contact" className="text-accent underline-offset-2 hover:underline">We'd love to talk.</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}