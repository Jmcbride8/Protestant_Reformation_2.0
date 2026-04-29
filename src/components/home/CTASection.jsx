import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useChurchInfo } from '@/hooks/useChurchInfo';

export default function CTASection() {
  const info = useChurchInfo();
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl sm:text-5xl mb-6 italic">
            Meet God, Build Family, Make Friends
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-relaxed">
            You don't need to have it all figured out. You don't need to dress a certain way. 
            You just need to show up and see if God does too.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Clock className="w-5 h-5" />
              <span className="font-body">{info.sunday_times_display}</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <MapPin className="w-5 h-5" />
              <span className="font-body">{info.address}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-body tracking-wide">
                Plan Your Visit
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-body tracking-wide">
                Become a Member
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}