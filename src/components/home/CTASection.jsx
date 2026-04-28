import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

export default function CTASection() {
  const info = useChurchInfo();
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay" />
      {/* Accent line left */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/20" />
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left — heading */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-accent">Join Us</span>
            </div>
            <h2 className="font-heading text-5xl sm:text-6xl text-foreground leading-[0.95] mb-6 tracking-tight">
              COME<br />
              AS<br />
              <span className="text-accent">YOU ARE</span>
            </h2>
            <p className="font-body text-foreground/50 leading-relaxed max-w-sm">
              You don't need to have it all figured out. You don't need to dress a certain way. 
              Just show up and see if God does too.
            </p>
          </div>

          {/* Right — details + CTAs */}
          <div className="space-y-8">
            {/* Info blocks */}
            <div className="space-y-0">
              <div className="flex items-center gap-4 border-t border-white/8 py-5">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="font-mono text-xs text-foreground/30 uppercase tracking-widest mb-1">Services</p>
                  <p className="font-body text-foreground">{info.sunday_times_display}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-white/8 py-5">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="font-mono text-xs text-foreground/30 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-body text-foreground">{info.address}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/contact">
                <button className="group flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 font-mono text-sm tracking-widest uppercase hover:bg-accent/90 transition-colors">
                  Plan Your Visit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="group flex items-center gap-3 border border-white/15 text-foreground px-8 py-4 font-mono text-sm tracking-widest uppercase hover:border-white/40 hover:bg-white/5 transition-all">
                  Become a Member
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}