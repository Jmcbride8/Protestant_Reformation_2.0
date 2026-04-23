import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EditableText from './EditableText';

const advantages = [
  {
    icon: Clock,
    title: 'Quick to Build',
    descKey: 'tech_fast',
    defaultDesc: 'Things that would take a development agency weeks can be up and running in hours — the carpool board, the support wall, the sermon archive. Small teams can move fast.',
  },
  {
    icon: DollarSign,
    title: 'Built for Small Budgets',
    descKey: 'tech_affordable',
    defaultDesc: 'No expensive agencies, no ongoing retainers. A small congregation with a willing volunteer can have a warm, fully functional online home.',
  },
  {
    icon: Zap,
    title: 'Simple to Keep Up',
    descKey: 'tech_easy',
    defaultDesc: 'Any staff member or volunteer can add sermons, update groups, and manage the community board — no technical background needed. The site stays fresh and alive.',
  },
];

export default function VisionTechnology({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Built on Base44</p>
          <h2 className="font-heading text-4xl text-white mb-5">A Full Team in Your Pocket</h2>
          <EditableText
            storageKey="tech_intro"
            defaultText="This entire platform — every page, every feature, every interactive tool — was built using Base44.com, an AI-powered platform that gives small teams the capability of a full development studio. No code required. No compromises on functionality."
            className="font-body text-white/70 max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <adv.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading text-lg text-white mb-2">{adv.title}</h3>
              <EditableText
                storageKey={adv.descKey}
                defaultText={adv.defaultDesc}
                className="font-body text-sm text-white/60 leading-relaxed"
                isAdmin={isAdmin}
              />
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center border-t border-white/10 pt-14"
        >
          <h3 className="font-heading text-3xl text-white mb-4">Ready to explore this for your church?</h3>
          <EditableText
            storageKey="tech_cta_body"
            defaultText="This platform is designed to be transferred, adapted, and built upon. If you're a pastor or church leader curious about what's possible, let's talk."
            className="font-body text-white/60 mb-8 max-w-xl mx-auto"
            isAdmin={isAdmin}
          />
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
              Get in Touch
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}