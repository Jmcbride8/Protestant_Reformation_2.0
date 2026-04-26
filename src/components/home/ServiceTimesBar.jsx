import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

const SERVICE_TIMES = [
  { day: 'Sunday', time: '9:00 AM', label: 'Morning Worship' },
  { day: 'Sunday', time: '11:00 AM', label: 'Main Service' },
  { day: 'Wednesday', time: '7:00 PM', label: 'Midweek Prayer' },
];

const ADDRESS = '123 Hope Street, Santa Barbara, CA 93101';
const MAPS_URL = 'https://maps.google.com/?q=Hope+Church+Santa+Barbara+CA';
const EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.1!2d-119.6982!3d34.4208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDI1JzE1LjAiTiAxMTnCsDQxJzUzLjUiVw!5e0!3m2!1sen!2sus!4v1234567890';

export default function ServiceTimesBar() {
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
              {SERVICE_TIMES.map((s, i) => (
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
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors mb-6 group"
            >
              {ADDRESS}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video w-full">
              <iframe
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hope Church location"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}