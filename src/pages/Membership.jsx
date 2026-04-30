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
  {
    text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
    ref: "Colossians 3:15",
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
    num: '01',
    title: 'Attend a Service',
    body: 'Come as you are. You don\'t need to believe anything specific yet — just show up.',
  },
  {
    num: '02',
    title: 'Follow Jesus',
    body: 'Faith isn\'t a prerequisite — it\'s an invitation. We walk with you wherever you are on that journey.',
  },
  {
    num: '03',
    title: 'Become a Member',
    body: 'When you\'re ready, fill out a short application. We review every one personally.',
  },
  {
    num: '04',
    title: 'Be More Than a Number',
    body: 'Church isn\'t a place or program — it\'s your family in Christ. Build friendships, offer mutual support and do life together in the ways that matter.',
  },
];

const benefits = [
  'Get connected to get involved (we\'re friendly, we promise)',
  'Lets us know to plug you in — no more flying solo',
  'Find your place to serve — yes, even you',
  'Be part of the conversation as we grow together',
  'Do life with people who actually show up',
];

export default function Membership() {
  const [showModal, setShowModal] = useState(false);

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
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

          <div>
            <h2 className="font-heading text-4xl text-primary mb-6">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-secondary/20 border border-border/50 rounded-2xl p-8"
                >
                  <p className="font-heading text-4xl text-accent/40 mb-4">{step.num}</p>
                  <h3 className="font-heading text-xl text-primary mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                </motion.div>
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
              The Best Platform for <span className="italic">Transformation</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Government disenfranchises. NGOs get corrupted. Celebrities chase optics. The church catalyzes—operating through <span className="text-accent font-semibold">love, not force</span>. Inner transformation. Family healing. Communal restoration. Global redemption. See it, be it, <span className="text-accent font-semibold">become</span> the change.
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