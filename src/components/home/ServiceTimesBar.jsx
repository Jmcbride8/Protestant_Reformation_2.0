import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

export default function ServiceTimesBar() {
  const info = useChurchInfo();

  return (
    <section className="py-20 bg-card border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-16 items-start"
        >
          {/* Service Times */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-accent" />
              <Clock className="w-4 h-4 text-accent/60" />
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Gather</p>
            </div>
            <h2 className="font-heading text-3xl text-foreground mb-8 tracking-tight">SERVICE TIMES</h2>
            <div className="space-y-0">
              {info.service_times.map((s, i) => (
                <div key={i} className="flex items-center justify-between border-t border-white/5 py-5 last:border-b last:border-white/5">
                  <div>
                    <p className="font-mono text-sm text-foreground">{s.day.toUpperCase()}</p>
                    <p className="font-body text-xs text-foreground/30 mt-0.5">{s.label}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <p className="font-heading text-2xl text-accent tracking-tight">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px bg-white/5 self-stretch" />

          {/* Location */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-accent" />
              <MapPin className="w-4 h-4 text-accent/60" />
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Location</p>
            </div>
            <h2 className="font-heading text-3xl text-foreground mb-4 tracking-tight">SANTA BARBARA, CA</h2>
            <a
              href={info.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-foreground/30 hover:text-accent transition-colors mb-8 group uppercase tracking-widest"
            >
              {info.address}
              <ExternalLink className="w-3 h-3 group-hover:text-accent" />
            </a>
            {info.maps_embed_url && (
              <div className="overflow-hidden border border-white/10 aspect-video w-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <iframe
                  src={info.maps_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hope Church location"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}