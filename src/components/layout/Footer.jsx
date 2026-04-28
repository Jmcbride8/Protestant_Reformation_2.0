import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

function CrossSvg({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="10" y="1" width="4" height="22" rx="1"/>
      <rect x="1" y="9" width="22" height="4" rx="1"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a0a08 0%, #0d0604 100%)' }}>
      {/* Subtle diagonal texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #c8922a 0px, #c8922a 1px, transparent 1px, transparent 50px)'
      }} />

      {/* Gold top border rule */}
      <div className="relative h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #c8922a, #8b6820, #c8922a, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <img 
              src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png" 
              alt="Hope Santa Barbara" 
              className="h-16 w-auto brightness-0 invert mb-4 opacity-80"
            />
            <p className="font-body text-base text-white/50 leading-relaxed">
              A community anchored in faith, built on truth and love, and open to all.
            </p>
          </div>

          {/* Visit */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CrossSvg className="w-3 h-3 text-[#c8922a]/60 shrink-0" />
              <h4 className="font-heading text-sm tracking-widest uppercase text-[#c8922a]">Visit Us</h4>
            </div>
            <div className="space-y-3 font-ui text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#c8922a]/40" />
                <span>3942 La Colina Rd.<br />Santa Barbara, CA 93110</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-[#c8922a]/40" />
                <span>Sundays at 9:00 & 11:00 AM</span>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CrossSvg className="w-3 h-3 text-[#c8922a]/60 shrink-0" />
              <h4 className="font-heading text-sm tracking-widest uppercase text-[#c8922a]">Connect</h4>
            </div>
            <div className="space-y-3 font-ui text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#c8922a]/40" />
                <span>(805) 555-HOPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#c8922a]/40" />
                <span>hello@hopesantabarbara.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CrossSvg className="w-3 h-3 text-[#c8922a]/60 shrink-0" />
              <h4 className="font-heading text-sm tracking-widest uppercase text-[#c8922a]">Quick Links</h4>
            </div>
            <div className="space-y-2 font-ui text-sm">
              <Link to="/sermons" className="block text-white/50 hover:text-[#c8922a] transition-colors">Sermons & Beliefs</Link>
              <Link to="/services" className="block text-white/50 hover:text-[#c8922a] transition-colors">Life Services</Link>
              <Link to="/giving" className="block text-white/50 hover:text-[#c8922a] transition-colors">Give</Link>
              <Link to="/volunteer" className="block text-white/50 hover:text-[#c8922a] transition-colors">Volunteer</Link>
              <Link to="/contact" className="block text-white/50 hover:text-[#c8922a] transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CrossSvg className="w-3 h-3 text-[#c8922a]/60 shrink-0" />
              <h4 className="font-heading text-sm tracking-widest uppercase text-[#c8922a]">About This Site</h4>
            </div>
            <div className="space-y-2 font-ui text-sm">
              <Link to="/vision" className="block text-white/50 hover:text-[#c8922a] transition-colors">Vision & Design Philosophy</Link>
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(200, 146, 42, 0.12)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-ui text-xs text-white/25 tracking-widest uppercase">
              © {new Date().getFullYear()} Hope Church Santa Barbara
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-[#c8922a]/20" />
              <CrossSvg className="w-3 h-3 text-[#c8922a]/30" />
              <div className="w-8 h-px bg-[#c8922a]/20" />
            </div>
            <p className="font-ui text-xs text-white/20 tracking-widest uppercase">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}