import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Users, Zap } from 'lucide-react';
import EditableText from './EditableText';

const stages = [
  {
    icon: Heart,
    title: "New Beginnings",
    description: "Young singles finding community, meeting, falling in love, and building families in faith."
  },
  {
    icon: Users,
    title: "Growing Together",
    description: "Young families navigating parenthood, raising children in the Gospel, and building rhythms of discipleship."
  },
  {
    icon: MapPin,
    title: "Roots & Legacy",
    description: "Established families stewarding their gifts, mentoring the next generation, and deepening their walk."
  },
  {
    icon: Zap,
    title: "Seasons of Change",
    description: "Empty nesters, retirees, those facing health challenges, grief, and the end of life — all equally worthy of pastoral care."
  }
];

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
          <h2 className="font-heading text-4xl text-primary mb-5">The Product Lifecycle of Faith</h2>
          <EditableText
            storageKey="lifecycle_intro"
            defaultText="The Christian life doesn't follow a single template. It's earthy, practical, and deeply seasonal. Every stage — from young singles to empty nesters to those facing their final chapter — deserves a church that shows up, pays attention, and meets people where they actually are. Not all moments matter equally, but when the big questions arise, when milestone moments come, when real challenges hit — the church should be ready."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Life stages grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-7"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg text-primary mb-2">{stage.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
              </motion.div>
            );
          })}
        </div>

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
            defaultText="Christ cared for all seasons of human life — the celebrations and the sorrows, the beginnings and the endings. So should we. We built this platform to help churches recognize that all of life matters, to show up for the moments that truly matter, and to help people navigate their unique spiritual journey — from one milestone to the next. Like Pilgrim's Progress, the Christian life is a journey. We're here to help churches walk alongside people every step of the way."
            className="font-body text-lg leading-relaxed italic"
            isAdmin={isAdmin}
          />
        </motion.div>
      </div>
    </section>
  );
}