import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Droplet, Heart, Baby, Users, Flower2, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const milestoneTypes = [
  {
    icon: Droplet,
    title: "Baptism",
    description: "Ready to take the next step in your faith? Baptism is a beautiful public declaration of your commitment to follow Jesus.",
    cta: "Sign Up for Baptism"
  },
  {
    icon: Heart,
    title: "Wedding",
    description: "Our beautiful sanctuary is available for weddings at cost. Let us help make your special day sacred and memorable.",
    cta: "Plan Your Wedding"
  },
  {
    icon: Baby,
    title: "Child Dedication",
    description: "Dedicate your child to God and commit to raising them in faith. A meaningful ceremony surrounded by our church family.",
    cta: "Schedule Dedication"
  },
  {
    icon: Flower2,
    title: "Funerals & Memorials",
    description: "In your time of loss, we're here to care for you. Our pastoral team helps plan a service that honors your loved one.",
    cta: "Contact Us"
  },
  {
    icon: Users,
    title: "Membership",
    description: "Take the step to formally join our Hope Church family. We'll walk you through the process and welcome you home.",
    cta: "Apply for Membership"
  }
];

export default function Milestones() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Life Moments</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Sacred <span className="italic">Milestones</span>
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
            {milestoneTypes.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group p-8 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-card"
                >
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-heading text-2xl text-primary mb-3">{milestone.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6 text-sm">
                    {milestone.description}
                  </p>
                  <a href="/contact">
                    <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80">
                      {milestone.cta} <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}