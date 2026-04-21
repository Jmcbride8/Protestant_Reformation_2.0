import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, UtensilsCrossed, ArrowRight } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

export default function LifeMilestonesSection({ weddingImage, mealImage, isAdmin }) {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Community Life</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Your Church for Life's Moments</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hope Church is more than a Sunday service. We're here for weddings, meals, milestones, 
            and every moment that matters — open to everyone in Santa Barbara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weddings Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl"
          >
            <EditableImage
              imageKey="milestone_wedding"
              src={weddingImage}
              alt="Weddings at Hope Church"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              isAdmin={isAdmin}
              wrapperClassName="aspect-[4/3] overflow-hidden relative group/editimg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-white/80" />
                <span className="font-body text-xs tracking-[0.2em] uppercase text-white/70">Weddings</span>
              </div>
              <h3 className="font-heading text-3xl text-white mb-3">
                Beautiful Weddings, <br /><span className="italic">At Cost</span>
              </h3>
              <p className="font-body text-white font-semibold text-lg mb-1">$500 venue rental</p>
              <p className="font-body text-white/80 mb-4 max-w-md text-sm leading-relaxed">
                In a world that often treats commitment as optional, Jesus calls love a covenant — and so do we. Our historic sanctuary is open to all as our way of saying: your marriage matters, and we'll walk with you into it.
              </p>
              <Link to="/contact">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                  Inquire About Weddings
                  <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Community Meals Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl"
          >
            <EditableImage
              imageKey="milestone_meals"
              src={mealImage}
              alt="Community Meals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              isAdmin={isAdmin}
              wrapperClassName="aspect-[4/3] overflow-hidden relative group/editimg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <UtensilsCrossed className="w-5 h-5 text-white/80" />
                <span className="font-body text-xs tracking-[0.2em] uppercase text-white/70">Weekly Meals</span>
              </div>
              <h3 className="font-heading text-3xl text-white mb-3">
                Gather Around <br /><span className="italic">The Table</span>
              </h3>
              <p className="font-body text-white font-semibold text-lg mb-1">$5 per person</p>
              <p className="font-body text-white/80 mb-4 max-w-md text-sm leading-relaxed">
                Every Wednesday evening, we share a home-style meal together — at cost. 
                No membership required. Just come as you are and bring your appetite for good food and great company.
              </p>
              <Link to="/services">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                  Learn More
                  <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}