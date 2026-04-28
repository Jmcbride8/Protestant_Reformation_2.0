import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function Milestones() {
  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones'],
    queryFn: () => base44.entities.Milestone.list('sort_order', 50),
  });
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Life Moments</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Life <span className="italic">Milestones</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              From your first public declaration of faith to your final farewell, Hope Church is here to walk alongside you through life's most important moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Milestones Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.filter(m => m.is_active !== false).map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-card"
              >
                <div className="relative h-48 overflow-hidden bg-secondary">
                  <img
                    src={milestone.image_url}
                    alt={milestone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-2xl text-primary mb-3">{milestone.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6 text-sm">
                    {milestone.description}
                  </p>
                  <a href="/contact">
                    <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80">
                      {milestone.cta} <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}