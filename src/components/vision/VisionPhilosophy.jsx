import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Network, Heart, Users, ArrowRight } from 'lucide-react';
import EditableText from './EditableText';

const verses = [
  { text: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer… And the Lord added to their number daily those who were being saved.", ref: "Acts 2:42, 47" },
  { text: "From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work.", ref: "Ephesians 4:16" },
];

export default function VisionPhilosophy({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">The Philosophical Lineage</p>
          <h2 className="font-heading text-4xl text-primary mb-5">Growth <span className="italic">and</span> Family</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            God's vision for the church was never either/or. It was both: a movement that spread to every corner of the earth — and a family where every person was known. The question is how.
          </p>
        </motion.div>

        {/* Scripture — two verses side by side */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {verses.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary rounded-2xl p-7 flex flex-col justify-between"
            >
              <p className="font-heading text-lg italic text-white/90 leading-relaxed mb-4">"{v.text}"</p>
              <p className="font-body text-xs text-accent font-medium">— {v.ref}</p>
            </motion.div>
          ))}
        </div>

        {/* Federation insight — full-width feature block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative bg-secondary/40 border border-border rounded-3xl p-10 mb-10 overflow-hidden"
        >
          {/* Background watermark */}
          <span className="absolute right-8 top-6 font-heading text-[8rem] leading-none text-border/60 select-none pointer-events-none">1787</span>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Network className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-accent">The Model</p>
                <h3 className="font-heading text-2xl text-primary leading-tight">Federalism — A Christian Innovation</h3>
              </div>
            </div>

            <EditableText
              storageKey="philosophy_federation"
              defaultText="The American federal system wasn't just a political invention — it was a theological one. Its architects, shaped by Calvinist and Reformed thinking, were deeply suspicious of concentrated power. Their solution: push authority and resources down to the local level. Let communities govern themselves. Keep decision-making close to the people it affects."
              className="font-body text-muted-foreground leading-relaxed mb-4"
              isAdmin={isAdmin}
            />
            <EditableText
              storageKey="philosophy_federation2"
              defaultText="The same instinct runs through the New Testament church. Not a centralized hierarchy issuing directives — but a network of local congregations, each led by elders, each caring for its own, each connected to something larger. Intimacy at the local level. Scale across the network."
              className="font-body text-muted-foreground leading-relaxed"
              isAdmin={isAdmin}
            />
          </div>
        </motion.div>

        {/* Two pillars — redesigned */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl text-primary mb-3">Relationships at Every Size</h3>
            <EditableText
              storageKey="philosophy_roots"
              defaultText="The early church grew explosively — and stayed personal. Members knew each other's names, ate in each other's homes, and carried each other's burdens. Acts describes a community so visibly caring that it drew outsiders in. That wasn't despite their growth. It was how they grew."
              className="font-body text-muted-foreground leading-relaxed text-sm flex-1"
              isAdmin={isAdmin}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-2xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-5">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading text-xl text-primary mb-3">Technology as Infrastructure</h3>
            <EditableText
              storageKey="philosophy_people"
              defaultText="We believed technology could play the same role federalism did — making local connection practical at any scale. Not replacing the meal, the conversation, the care. Making it easier to find, offer, and sustain. A platform that serves community rather than substituting for it."
              className="font-body text-muted-foreground leading-relaxed text-sm flex-1"
              isAdmin={isAdmin}
            />
          </motion.div>
        </div>

        {/* WikiChurch reference — compact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 bg-muted/50 border border-border rounded-2xl px-7 py-5"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs tracking-widest uppercase text-accent mb-0.5">Foundational Reading</p>
            <p className="font-heading text-lg text-primary">WikiChurch — Steve Murrell</p>
            <p className="font-body text-sm text-muted-foreground mt-1">A church less like a lecture hall, more like a living, collaboratively built resource — where every member contributes.</p>
          </div>
          <a
            href="https://www.amazon.com/WikiChurch-Making-Discipleship-Engaging-Empowering/dp/1616384441"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}