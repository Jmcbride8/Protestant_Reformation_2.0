import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

function CrossSvg({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="10" y="1" width="4" height="22" rx="1"/>
      <rect x="1" y="9" width="22" height="4" rx="1"/>
    </svg>
  );
}

export default function CTASection() {
  const info = useChurchInfo();
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a0a08 0%, #3d1414 50%, #1a0a08 100%)' }}>
      {/* Radial gold glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #c8922a 0%, transparent 70%)' }} />
      </div>

      {/* Diagonal lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, #c8922a 0px, #c8922a 1px, transparent 1px, transparent 60px)'
      }} />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-14 h-14 border-l-2 border-t-2 border-[#c8922a]/30" />
      <div className="absolute top-8 right-8 w-14 h-14 border-r-2 border-t-2 border-[#c8922a]/30" />
      <div className="absolute bottom-8 left-8 w-14 h-14 border-l-2 border-b-2 border-[#c8922a]/30" />
      <div className="absolute bottom-8 right-8 w-14 h-14 border-r-2 border-b-2 border-[#c8922a]/30" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Top cross ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c8922a]/50" />
            <CrossSvg className="w-5 h-5 text-[#c8922a]/70" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c8922a]/50" />
          </div>

          <p className="font-ui text-xs tracking-[0.5em] uppercase text-[#c8922a] mb-6">An Invitation</p>

          <h2 className="font-heading text-5xl sm:text-6xl text-white mb-6 tracking-wide leading-tight">
            Come As You Are
          </h2>

          {/* Gold underline */}
          <div className="w-20 h-0.5 mx-auto mb-8" style={{ background: 'linear-gradient(to right, transparent, #c8922a, transparent)' }} />

          <p className="font-body text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            You don't need to have it all figured out. You don't need to dress a certain way. 
            You just need to show up and see if God does too.
          </p>
          
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            <div className="flex items-center gap-2 text-[#c8922a]/70">
              <Clock className="w-4 h-4" />
              <span className="font-ui text-sm">{info.sunday_times_display}</span>
            </div>
            <div className="flex items-center gap-2 text-[#c8922a]/70">
              <MapPin className="w-4 h-4" />
              <span className="font-ui text-sm">{info.address}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="font-ui tracking-widest uppercase text-xs px-10 py-6 border border-[#c8922a] hover:opacity-90 transition-all"
                style={{ background: '#c8922a', color: '#1a0a08' }}
              >
                Plan Your Visit
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-ui tracking-widest uppercase text-xs px-10 py-6 border-white/20 text-white hover:bg-white/10"
              >
                Become a Member
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}