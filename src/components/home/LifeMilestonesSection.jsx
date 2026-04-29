import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, UtensilsCrossed, ArrowRight, Smile, Car } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

export default function LifeMilestonesSection({ weddingImage, mealImage, kidsImage, collegeImage, isAdmin }) {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">We keep it real</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Your Church for Life's Moments</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hope Church is more than a Sunday service. We're here for weddings, meals, milestones, 
            and every moment that matters — open to everyone in Santa Barbara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carpool Card */}
          <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="group relative overflow-hidden rounded-2xl"
          >
           <EditableImage
             imageKey="milestone_carpool"
             src={collegeImage}
             alt="College Carpool"
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             isAdmin={isAdmin}
             wrapperClassName="aspect-[4/3] overflow-hidden relative group/editimg"
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 p-8">
             <div className="flex items-center gap-2 mb-3">
               <Car className="w-5 h-5 text-white/80" />
               <span className="font-body text-xs tracking-[0.2em] uppercase text-white/70">College Carpool</span>
             </div>
             <h3 className="font-heading text-3xl text-white mb-3">
               Carpool to Church <br /><span className="italic">for College Students</span>
             </h3>
             <p className="font-body text-white/80 mb-4 max-w-md text-sm leading-relaxed">
               No car? No problem. Church members offer free Sunday rides to students from UCSB, Westmont University, and across Santa Barbara. Just add your name and number — we'll handle the rest.
             </p>
             <Link to="/carpool">
               <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                 Find a Ride
                 <ArrowRight className="ml-2 w-3 h-3" />
               </Button>
             </Link>
           </div>
          </motion.div>

          {/* Hope 4 Kids Card */}
          <motion.div
           initial={{ opacity: 0, x: 0 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="group relative overflow-hidden rounded-2xl"
          >
           <EditableImage
             imageKey="milestone_kids"
             src={kidsImage}
             alt="Hope 4 Kids Early Learning Centers"
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             isAdmin={isAdmin}
             wrapperClassName="aspect-[4/3] overflow-hidden relative group/editimg"
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 p-8">
             <div className="flex items-center gap-2 mb-3">
               <Smile className="w-5 h-5 text-white/80" />
               <span className="font-body text-xs tracking-[0.2em] uppercase text-white/70">Early Learning</span>
             </div>
             <h3 className="font-heading text-3xl text-white mb-3">
               Hope 4 Kids <br /><span className="italic">Learning Centers</span>
             </h3>
             <p className="font-body text-white/80 mb-4 max-w-md text-sm leading-relaxed">
               Our ministry provides affordable, high-quality early learning for families in Santa Barbara. Because every child deserves care rooted in faith, compassion, and intentional community — regardless of circumstance.
             </p>
             <Link to="/contact">
               <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                 Learn More
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
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
                Santa Barbara is one of the wealthiest cities in America — and one of the loneliest for those left out. Jesus made a habit of sitting down with the hungry, the overlooked, and the uninvited. Every Wednesday, so do we.
              </p>
              <Link to="/services">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                  Learn More
                  <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>

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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
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
                Our sanctuary is open to all as our way of honoring marriage, and helping you start that journey
              </p>
              <Link to="/contact">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-body text-xs">
                  Inquire About Weddings
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