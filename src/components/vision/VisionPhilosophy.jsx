import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Globe } from 'lucide-react';

export default function VisionPhilosophy() {
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
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Foundational Philosophy</p>
          <h2 className="font-heading text-4xl text-primary mb-5">
            A Centralized Collective of Decentralized Groups
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The most enduring community structures in history share a common trait: they scale through empowered local participation,
            not through ever-expanding centralized authority.
          </p>
        </motion.div>

        {/* WikiChurch reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 mb-10 flex flex-col md:flex-row gap-8 items-start"
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-accent mb-2">Foundational Reading</p>
            <h3 className="font-heading text-2xl text-primary mb-2">
              WikiChurch — Steve Murrell
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-3">
              Murrell's "WikiChurch" provided the conceptual foundation for this design: a church that functions less like a lecture hall
              and more like a living, collaboratively built resource — where every member is an active contributor, not a passive audience.
              Like a wiki, its value grows as more people participate.
            </p>
            <a
              href="https://www.amazon.com/WikiChurch-Making-Discipleship-Engaging-Empowering/dp/1616384441"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-accent hover:underline"
            >
              View on Amazon →
            </a>
          </div>
        </motion.div>

        {/* Two pillars */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-7"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl text-primary mb-3">The Federated Model</h3>
            <p className="font-body text-muted-foreground leading-relaxed text-sm">
              The United States achieved scale not by making Washington do everything, but by trusting local and state governments
              to carry the load closest to the people. Churches can do the same — a strong center that holds, with
              empowered groups doing the daily work of pastoral care, fellowship, and outreach at the neighborhood level.
              No tech jargon required. This is simply how enduring communities have always worked.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-7"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading text-xl text-primary mb-3">Relationships Over Messages</h3>
            <p className="font-body text-muted-foreground leading-relaxed text-sm">
              The Sunday sermon is vital — but it cannot be the sum total of a church's relational life. When information
              and programming dominate, community quietly erodes. People need to know each other: to share meals,
              offer rides, carry burdens, and celebrate milestones together. This site is designed to make those
              interactions easy, visible, and ongoing — not exceptional.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}