import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Users, BookOpen, Droplets, UserPlus, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Hand, Target } from 'lucide-react';
import BecomeMemberModal from '@/components/membership/BecomeMemberModal';

const quotes = [
  {
    text: "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another — and all the more as you see the Day approaching.",
    ref: "Hebrews 10:24–25",
  },
  {
    text: "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.",
    ref: "Ecclesiastes 4:9–10",
  },
  {
    text: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.",
    ref: "Acts 2:42",
  },
  {
    text: "Bear one another's burdens, and so fulfill the law of Christ.",
    ref: "Galatians 6:2",
  },
  {
    text: "Above all, love each other deeply, because love covers over a multitude of sins. Offer hospitality to one another without grumbling.",
    ref: "1 Peter 4:8–9",
  },
];

function QuoteGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {quotes.map((quote, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-primary text-primary-foreground rounded-2xl p-8 flex flex-col justify-between h-full"
        >
          <p className="font-heading text-lg sm:text-xl italic leading-relaxed mb-6">
            "{quote.text}"
          </p>
          <p className="font-body text-sm text-primary-foreground/70">— {quote.ref}</p>
        </motion.div>
      ))}
    </div>
  );
}

const steps = [
  {
    icon: Heart,
    title: 'Follow Jesus',
    description: 'Membership begins with a personal faith in Jesus Christ. We\'d love to hear your story.',
  },
  {
    icon: Users,
    title: 'Connect with the Community',
    description: 'Attend services, join a small group, and get to know the people of Hope Church.',
  },
  {
    icon: UserPlus,
    title: 'Become a Member',
    description: 'Fill the form to let us know, and we\'ll get back to you.',
  },
];

function StepCard({ step, isOpen, onToggle, index }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-card'}`}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-6 text-left">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-accent/15' : 'bg-secondary'}`}>
          <Icon className={`w-5 h-5 transition-colors ${isOpen ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-heading text-lg text-primary">{step.title}</h4>
          <p className="font-body text-sm text-muted-foreground mt-0.5">{step.description}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
            <div className="px-6 pb-6 pt-0 pl-20">
              <p className="font-body text-muted-foreground leading-relaxed text-sm">{step.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const benefits = [
  'Get connected to get involved (we\'re friendly, we promise)',
  'Lets us know to plug you in — no more flying solo',
  'Find your place to serve — yes, even you',
  'Be part of the conversation as we grow together',
  'Do life with people who actually show up',
];

export default function Membership() {
  const [showModal, setShowModal] = useState(false);
  const [openStepIndex, setOpenStepIndex] = useState(null);

  return (
    <div className="pt-20">
      {showModal && <BecomeMemberModal onClose={() => setShowModal(false)} />}

      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Membership</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              More Than <span className="italic">Attending</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Church membership is about belonging — making Hope Church your home. It is for when you are ready to move from being a visitor to becoming family.
            </p>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="font-body bg-primary hover:bg-primary/90 gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Become a Member
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What Membership Means */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-heading text-4xl text-primary mb-6">What Does Membership Mean?</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                We believe the local church is God's primary means of growing people and reaching the world. 
                Membership is how you plant yourself in that mission.
              </p>
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-4xl text-primary mb-6">How It Works</h2>
              {steps.map((step, i) => (
                <StepCard key={i} step={step} index={i} isOpen={openStepIndex === i} onToggle={() => setOpenStepIndex(openStepIndex === i ? null : i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built for Community */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Community Matters</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">
              We Were Made for <span className="italic">Each Other</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              God designed us for and called us to live in community — yes, even us introverts.
            </p>
            <QuoteGrid />
          </motion.div>






        </div>
      </section>

      {/* Generosity Platform */}
      <section className="py-32 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(38 45% 60%) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(38 45% 60%) 0%, transparent 40%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="font-body text-sm tracking-[0.3em] uppercase text-accent">Impact That Matters</p>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              The Best Platform for <span className="italic">Generosity</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The local church is one of the most powerful and accountable vehicles for community impact. 
              We put generosity in the hands of people who actually know their neighbors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Target, title: 'See the Need', desc: 'Direct relationships with real people in real need' },
              { icon: Hand, title: 'Show Up', desc: 'Your generosity flows through trusted hands' },
              { icon: Heart, title: 'Stick Around', desc: 'We\'re here for the long-term transformation' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-8 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl text-primary mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl px-12 py-12 text-center max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, hsl(38 45% 60%) 0%, transparent 50%)' }} />
            <p className="font-body text-lg text-primary-foreground/90 leading-relaxed relative z-10">
              Membership is how you go from <span className="font-semibold">spectator to participant</span>. It's where you stop waiting for someone else to fix things, and start being the community you wish existed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-4xl sm:text-5xl mb-4 italic">Ready to Take the Step?</h2>
            <p className="font-body text-primary-foreground/80 mb-8 leading-relaxed">
              Submit your application and our pastoral team will be in touch to walk you through the next steps.
            </p>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="bg-white text-primary hover:bg-white/90 font-body tracking-wide gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Become a Member
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}