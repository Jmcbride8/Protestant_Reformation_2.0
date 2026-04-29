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
    icon: BookOpen,
    title: 'Attend a Membership Class',
    description: 'We\'ll share our vision, values, and what it means to be part of this family.',
  },
  {
    icon: Droplets,
    title: 'Consider Baptism',
    description: 'If you haven\'t been baptized, we encourage it as a public declaration of your faith.',
  },
  {
    icon: UserPlus,
    title: 'Submit Your Application',
    description: 'Our pastoral team will prayerfully review your application and reach out within 1–2 weeks.',
  },
];

const benefits = [
  'Vote in church decisions and elections',
  'Access member-only community resources',
  'Join a small group and pastoral care network',
  'Serve on ministry teams and leadership',
  'Be known — not just attending, but belonging',
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
              Church membership is a commitment — to God, to one another, and to the mission of Hope Church. 
              It's how you stop being a visitor and start being family.
            </p>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="font-body bg-primary hover:bg-primary/90 gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Apply for Membership
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
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                At Hope Church, membership is about family — showing up for each other, building something together, and doing life side by side. It's how you stop being a visitor and start belonging to something real.
              </p>
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
            Apply for Membership
          </Button>
        </div>
      </section>
    </div>
  );
}