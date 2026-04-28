import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png"
              alt="Hope Santa Barbara"
              className="h-14 w-auto brightness-0 invert mb-6 opacity-80"
            />
            <p className="font-body text-sm text-foreground/30 leading-relaxed max-w-xs mb-6">
              A community anchored in faith, built on truth and love, and open to all.
            </p>
            {/* Location block */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent/60 mt-0.5 shrink-0" />
                <span className="font-mono text-xs text-foreground/30">3942 La Colina Rd.<br />Santa Barbara, CA 93110</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-accent/60 shrink-0" />
                <span className="font-mono text-xs text-foreground/30">Sundays 9:00 & 11:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent/60 shrink-0" />
                <span className="font-mono text-xs text-foreground/30">(805) 555-HOPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent/60 shrink-0" />
                <span className="font-mono text-xs text-foreground/30">hello@hopesantabarbara.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6">Links</p>
            <div className="space-y-3">
              {[
                { to: '/sermons', label: 'Sermons' },
                { to: '/services', label: 'Programs' },
                { to: '/giving', label: 'Give' },
                { to: '/volunteer', label: 'Volunteer' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block font-mono text-xs tracking-widest uppercase text-foreground/30 hover:text-accent transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6">About</p>
            <div className="space-y-3">
              <Link to="/vision" className="block font-mono text-xs tracking-widest uppercase text-foreground/30 hover:text-accent transition-colors">
                Vision & Philosophy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-foreground/20 tracking-widest uppercase">
            © {new Date().getFullYear()} Hope Church Santa Barbara
          </p>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-accent" />
            <span className="font-mono text-xs text-foreground/20 tracking-widest uppercase">All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}