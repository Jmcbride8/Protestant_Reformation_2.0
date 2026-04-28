import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Play, Shield } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

// Crusader cross SVG ornament
function CrossOrnament({ className = "" }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="currentColor">
      <rect x="26" y="4" width="8" height="52" rx="2"/>
      <rect x="4" y="22" width="52" height="8" rx="2"/>
    </svg>
  );
}

export default function HeroSection({ heroImage, isAdmin }) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center" style={{overflow: 'hidden', contain: 'paint'}}>
      {/* Background image */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <EditableImage
          imageKey="hero"
          src={heroImage}
          alt="Hope Church Santa Barbara"
          className="absolute inset-0 w-full h-full object-cover"
          isAdmin={isAdmin}
          wrapperClassName="absolute inset-0 group/editimg"
        />
        {/* Dark crusader overlay — deep crimson-to-black */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a08]/95 via-[#2d0f0f]/75 to-[#1a0a08]/40" />
        {/* Subtle red glow from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#7a1515]/30 to-transparent" />
      </div>

      {/* Vertical gold rule lines */}
      <div className="absolute top-0 left-16 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c8922a]/30 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-16 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c8922a]/20 to-transparent hidden lg:block" />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-[#c8922a]/50 hidden lg:block" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-[#c8922a]/50 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-[#c8922a]/50 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-[#c8922a]/50 hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Cross ornament */}
          <div className="flex items-center gap-4 mb-6">
            <CrossOrnament className="w-5 h-5 text-[#c8922a]" />
            <p className="font-ui text-xs tracking-[0.4em] uppercase text-[#c8922a]">
              Welcome Home
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-[#c8922a]/60 to-transparent max-w-24" />
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl text-white leading-[1.05] mb-4 tracking-tight">
            A Place of
          </h1>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl leading-[1.05] mb-8 tracking-tight" 
              style={{ color: '#c8922a' }}>
            Hope & Life
          </h1>

          {/* Gold rule */}
          <div className="w-24 h-0.5 mb-8" style={{ background: 'linear-gradient(to right, #c8922a, transparent)' }} />

          <p className="font-body text-xl text-white/80 leading-relaxed mb-10 max-w-xl" style={{ fontSize: '1.25rem' }}>
            We gather to worship, grow in faith in Jesus Christ, and love for each other — 
            right here in Santa Barbara. No perfect people allowed.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="font-ui tracking-widest uppercase text-xs px-8 py-6 border border-[#c8922a] hover:bg-[#c8922a]/20 transition-all"
              style={{ background: '#c8922a', color: '#1a0a08' }}
              onClick={() => setVideoOpen(true)}
            >
              <Play className="mr-2 w-4 h-4" />
              What's Hope Like?
            </Button>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-ui tracking-widest uppercase text-xs px-8 py-6 border-white/30 text-white hover:bg-white/10"
              >
                Visit This Sunday
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0">
          <div className="aspect-video w-full">
            {videoOpen && (
              <iframe
                src="https://www.youtube.com/embed/i8tajrzRqlk?start=38&autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}