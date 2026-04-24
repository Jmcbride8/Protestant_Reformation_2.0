import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Globe } from 'lucide-react';
import EditableText from './EditableText';

export default function VisionPhilosophy({ isAdmin }) {
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
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">The Philosophical Lineage</p>
          <h2 className="font-heading text-4xl text-primary mb-5">One Family, Many Tables</h2>
          <EditableText
            storageKey="philosophy_intro"
            defaultText="These ideas didn't begin here. They were inherited — from scripture, from history, from thinkers and practitioners who understood that the deepest human needs are met not by institutions, but by people who know each other's names."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
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
          <div className="flex-1">
            <p className="font-body text-xs tracking-widest uppercase text-accent mb-2">Foundational Reading</p>
            <h3 className="font-heading text-2xl text-primary mb-2">WikiChurch — Steve Murrell</h3>
            <EditableText
              storageKey="philosophy_wikichurch"
              defaultText={`Murrell's "WikiChurch" provided the conceptual foundation for this design: a church that functions less like a lecture hall and more like a living, collaboratively built resource — where every member is an active contributor, not a passive audience. Like a wiki, its value grows as more people participate.`}
              className="font-body text-muted-foreground leading-relaxed mb-3"
              isAdmin={isAdmin}
            />
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
            <h3 className="font-heading text-xl text-primary mb-3">The Early Church Model</h3>
            <EditableText
              storageKey="philosophy_roots"
              defaultText="The first Christians didn't build cathedrals — they met in homes. They ate together, shared what they had, and looked after one another across neighborhoods and cities. The book of Acts describes a community so tangibly caring that outsiders took notice. This site is an attempt to ask: what would it look like to make that kind of daily, practical love easy again — in a modern church, in a connected age?"
              className="font-body text-muted-foreground leading-relaxed text-sm"
              isAdmin={isAdmin}
            />
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
            <h3 className="font-heading text-xl text-primary mb-3">People Before Programming</h3>
            <EditableText
              storageKey="philosophy_people"
              defaultText="The Sunday sermon is irreplaceable — but a church is more than what happens on stage. When the service ends and the week begins, people still need each other: a shared meal, a ride, someone to pray with, a friend who notices when you're missing. This site is designed to make those ordinary, sacred moments of care easy to find and easy to offer — every week, not just on special occasions."
              className="font-body text-muted-foreground leading-relaxed text-sm"
              isAdmin={isAdmin}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}