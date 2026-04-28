import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronDown } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

export default function HeroSection({ heroImage, isAdmin }) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background image with heavy dark overlay */}
      <div className="absolute inset-0">
        <EditableImage
          imageKey="hero"
          src={heroImage}
          alt="Hope Church Santa Barbara"
          className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale"
          isAdmin={isAdmin}
          wrapperClassName="absolute inset-0 group/editimg"
        />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay" />
      </div>

      {/* Accent vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/40" />
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5" />

      {/* Top status bar */}
      <div className="absolute top-24 left-0 right-0 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-accent" />
            <span className="font-mono text-xs text-accent tracking-[0.2em] uppercase">Live Community</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="font-mono text-xs text-foreground/30 tracking-widest uppercase">Hope Church — Santa Barbara, CA</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-accent" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-accent">Est. Santa Barbara</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-foreground leading-[0.95] mb-8 tracking-tight">
            A PLACE<br />
            OF <span className="text-accent">HOPE</span><br />
            & LIFE
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 max-w-xs h-px bg-white/10" />
            <span className="font-mono text-xs text-foreground/30">// JOHN 10:10</span>
          </div>

          {/* Body */}
          <p className="font-body text-lg text-foreground/60 leading-relaxed mb-10 max-w-lg">
            We gather to worship, grow in faith in Jesus Christ, and love for each other — right here in Santa Barbara. No perfect people allowed.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setVideoOpen(true)}
              className="group flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 font-mono text-sm tracking-widest uppercase hover:bg-accent/90 transition-colors"
            >
              <Play className="w-4 h-4" />
              Watch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/contact">
              <button className="group flex items-center gap-3 border border-white/20 text-foreground px-8 py-4 font-mono text-sm tracking-widest uppercase hover:border-white/50 hover:bg-white/5 transition-all">
                Visit Sunday
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right side technical readout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 text-right"
        >
          {['FAITH', 'FAMILY', 'COMMUNITY', 'MISSION'].map((item, i) => (
            <div key={item} className="flex items-center gap-3 justify-end">
              <span className="font-mono text-xs text-foreground/20 tracking-widest">{item}</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="font-mono text-xs text-accent/40">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-foreground/20 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 text-foreground/20 animate-bounce" />
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border border-white/10">
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