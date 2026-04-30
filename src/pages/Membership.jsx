import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Users, BookOpen, Droplets, UserPlus } from 'lucide-react';
import BecomeMemberModal from '@/components/membership/BecomeMemberModal';

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

            <div className="space-y-6">
              <h2 className="font-heading text-4xl text-primary mb-2">How It Works</h2>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-primary text-sm">{step.title}</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
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
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              God designed us for and called us to live in community — yes, even us introverts.
            </p>
            <div className="bg-primary text-primary-foreground rounded-2xl p-10 max-w-2xl mx-auto text-center">
              <p className="font-heading text-2xl sm:text-3xl italic mb-4 leading-snug">
                "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another — and all the more as you see the Day approaching."
              </p>
              <p className="font-body text-sm text-primary-foreground/70">— Hebrews 10:24–25</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                stat: '33%',
                label: 'Lower mortality risk',
                source: 'PLOS Medicine, 2010',
                description: 'A meta-analysis of 148 studies found that people with strong social relationships had a 50% greater likelihood of survival — comparable to quitting smoking.',
              },
              {
                stat: '80+',
                label: 'Years of data',
                source: 'Harvard Study of Adult Development',
                description: 'The longest-running study on human happiness concluded that close relationships — not wealth, fame, or achievement — are what keep people happy and healthy throughout their lives.',
              },
              {
                stat: '7 yrs',
                label: 'Longer life expectancy',
                source: 'American Journal of Public Health',
                description: 'Regular attendance at religious services is associated with living 7 years longer on average — driven largely by the social connection, sense of purpose, and community support they provide.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-8 text-center"
              >
                <p className="font-heading text-5xl text-accent mb-2">{item.stat}</p>
                <p className="font-body font-semibold text-primary text-lg mb-1">{item.label}</p>
                <p className="font-body text-xs text-muted-foreground mb-4 italic">{item.source}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary text-primary-foreground rounded-2xl p-10 max-w-3xl mx-auto text-center">
            <p className="font-heading text-2xl sm:text-3xl italic mb-4 leading-snug">
              "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."
            </p>
            <p className="font-body text-sm text-primary-foreground/70">— Ecclesiastes 4:9–10</p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="font-heading text-3xl text-primary mb-4 text-center">The Best Platform for Generosity</h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-4 text-center">
              The local church is one of the most powerful and accountable vehicles for community impact that exists. 
              Unlike faceless institutions, church puts generosity in the hands of people who actually know their neighbors — 
              who see the need, who show up, and who stick around.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed text-center">
              Membership is how you go from spectator to participant. It's where you stop waiting for someone else 
              to fix things, and start being the community you wish existed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto px-4">
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
        </div>
      </section>
    </div>
  );
}