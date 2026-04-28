import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

export default function ServiceTimesBar() {
  const info = useChurchInfo();

  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12 items-start"
        >
          {/* Service Times */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-white/60" />
              <p className="font-body text-xs tracking-[0.25em] uppercase text-white/60">Join Us</p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl mb-8 italic">Service Times</h2>
            <div className="space-y-4">
              {info.service_times.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5 last:border-0 last:pb-0 gap-1 sm:gap-0">
                  <div>
                    <p className="font-body font-semibold text-white text-base">{s.day}</p>
                    <p className="font-body text-sm text-white/60">{s.label}</p>
                  </div>
                  <p className="font-heading text-2xl italic text-white/90">{s.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-white/15 self-stretch" />

          {/* Location + Map */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-white/60" />
              <p className="font-body text-xs tracking-[0.25em] uppercase text-white/60">Find Us</p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl mb-4 italic">We're in Santa Barbara</h2>
            <a
              href={info.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors mb-6 group"
            >
              {info.address}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            {info.maps_embed_url && (
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-video w-full">
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