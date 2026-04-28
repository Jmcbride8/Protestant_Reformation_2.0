import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

function CrossSvg({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="10" y="1" width="4" height="22" rx="1"/>
      <rect x="1" y="9" width="22" height="4" rx="1"/>
    </svg>
  );
}

export default function ServiceTimesBar() {
  const info = useChurchInfo();

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a08 0%, #2d1010 40%, #1a0a08 100%)' }}>
      {/* Diagonal texture lines */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #c8922a 0px, #c8922a 1px, transparent 1px, transparent 40px)'
      }} />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-[#c8922a]/40" />
      <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-[#c8922a]/40" />
      <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-[#c8922a]/40" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-[#c8922a]/40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-16 items-start"
        >
          {/* Service Times */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-4 h-4 text-[#c8922a]/70" />
              <p className="font-ui text-xs tracking-[0.4em] uppercase text-[#c8922a]/70">Join Us</p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl mb-10 text-white tracking-wide">
              Service Times
            </h2>
            <div className="space-y-0">
              {info.service_times.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#c8922a]/15 py-5 last:border-0 gap-1 sm:gap-0">
                  <div>
                    <p className="font-heading text-white text-base tracking-wide">{s.day}</p>
                    <p className="font-ui text-xs text-[#c8922a]/60 tracking-wider uppercase mt-0.5">{s.label}</p>
                  </div>
                  <p className="font-heading text-2xl text-[#c8922a] tracking-wide">{s.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical gold divider */}
          <div className="hidden lg:flex flex-col items-center gap-3 self-stretch py-4">
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-[#c8922a]/30 to-transparent" />
            <CrossSvg className="w-4 h-4 text-[#c8922a]/50 shrink-0" />
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-[#c8922a]/30 to-transparent" />
          </div>

          {/* Location */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-[#c8922a]/70" />
              <p className="font-ui text-xs tracking-[0.4em] uppercase text-[#c8922a]/70">Find Us</p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl mb-4 text-white tracking-wide">
              Santa Barbara
            </h2>
            <a
              href={info.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-ui text-sm text-[#c8922a]/60 hover:text-[#c8922a] transition-colors mb-6 group"
            >
              {info.address}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            {info.maps_embed_url && (
              <div className="rounded overflow-hidden border border-[#c8922a]/20 aspect-video w-full">
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