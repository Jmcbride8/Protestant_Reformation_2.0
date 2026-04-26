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
          <h2 className="font-heading text-4xl text-primary mb-5">Making Major Moments Count</h2>
          <EditableText
            storageKey="lifecycle_intro"
            defaultText="John Bunyan's Pilgrim's Progress shows us that faith is a journey — not a destination you reach on Sunday. Every major moment in life is a waypoint: births, weddings, graduations, health crises, loss. These are the moments when people in our church deepen their faith, when people outside our church might turn to us, when growth actually happens. Are we there? Can we help people not just survive these seasons, but progress — drawing closer to Christ, to each other, and to the fullness He offers? This platform exists to catalyze that growth, enable genuine engagement, and help churches create lasting memories at every milestone."
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
            defaultText="Like Pilgrim's Progress, the Christian life is a journey of growth — not a single destination. We built this platform to help churches catalyze real spiritual progress, enable deeper engagement at life's pivotal moments, and create meaningful memories that last a lifetime. When a young couple gets married in your church, when a family welcomes a newborn, when someone faces their final season — these are sacred opportunities to walk alongside people and help them progress in faith. The journey matters. Every milestone counts."
            className="font-body text-lg leading-relaxed italic"
            isAdmin={isAdmin}
          />
        </motion.div>
      </div>
    </section>
  );
}