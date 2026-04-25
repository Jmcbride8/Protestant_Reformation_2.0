import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { HeartHandshake, Baby, Briefcase, BookOpen, HandHeart, Cross, ArrowRight, Users, UtensilsCrossed, Flame } from 'lucide-react';

const services = [
  { icon: HeartHandshake, label: "Marriage Counseling", description: "Strengthen your relationship with guided support" },
  { icon: Baby, label: "Parenting Support", description: "Navigate the joys and challenges of raising children" },
  { icon: Briefcase, label: "Career Guidance", description: "Find direction and purpose in your professional life" },
  { icon: BookOpen, label: "Grief Support", description: "Find healing and comfort in community" },
  { icon: HandHeart, label: "Prayer Requests", description: "Let us stand with you in prayer" },
  { icon: Cross, label: "Membership", description: "Become part of the Hope Church family" },
  { icon: Users, label: "Senior Ministry", description: "Companionship, transportation, and care for our elders" },
  { icon: UtensilsCrossed, label: "Street Outreach", description: "Hot meals and compassion for our unhoused neighbors" },
  { icon: Flame, label: "Discipleship", description: "For young adults ready to wrestle with theology, doctrine, and philosophy — and form a faith that's truly their own." },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Real People, Real Care</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Care & Support</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The building isn't the church - we are. Reach out to us, for the below or other steps on your life and faith journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="h-full"
              >
                <Link to="/contact" className="block group h-full">
                  <div className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-card h-full">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="font-heading text-xl text-primary mb-2">{service.label}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/contact">
            <Button size="lg" className="font-body tracking-wide bg-primary hover:bg-primary/90">
              Reach Out Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}