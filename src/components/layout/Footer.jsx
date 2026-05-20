import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-1">
            <img 
              src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png" 
              alt="Hope Santa Barbara" 
              className="h-16 w-auto brightness-0 invert mb-4"
            />
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              A community here to pursue God, nurture families and build friendships and memories.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Visit Us</h4>
            <div className="space-y-3 font-body text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>3942 La Colina Rd.<br />Santa Barbara, CA 93110</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Sundays at 9:00 & 11:00 AM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Connect</h4>
            <div className="space-y-3 font-body text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(805) 555-HOPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@hopesantabarbara.org</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Quick Links</h4>
            <div className="space-y-2 font-body text-sm">
              <Link to="/sermons" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Sermons & Beliefs</Link>
              <Link to="/services" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Life Services</Link>
              <Link to="/giving" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Give</Link>
              <Link to="/volunteer" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Volunteer</Link>
              <Link to="/contact" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact Us</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Vision & Design Philosophy</h4>
            <div className="space-y-2 font-body text-sm">
              <Link to="/vision" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Vision & Design Philosophy</Link>
              <Link to="/features" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">Features</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Hope Church Santa Barbara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}