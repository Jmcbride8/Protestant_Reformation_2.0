import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';

export default function HeroSection({ heroImage, isAdmin }) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center" style={{overflow: 'hidden', contain: 'paint'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <EditableImage
          imageKey="hero"
          src={heroImage}
          alt="Hope Church Santa Barbara"
          className="absolute inset-0 w-full h-full object-cover"
          isAdmin={isAdmin}
          wrapperClassName="absolute inset-0 group/editimg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-white/80 mb-4">
            Welcome Home
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            A Place of <br />
            <span className="italic">Hope & Life</span>
          </h1>
          <p className="font-body text-lg text-white/85 leading-relaxed mb-8 max-w-lg">
            We gather to worship, grow in faith in Jesus Christ, and love for each other — right here in Santa Barbara.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-body tracking-wide"
              onClick={() => setVideoOpen(true)}
            >
              <Play className="mr-2 w-4 h-4" />
              What's Hope Like?
            </Button>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-body tracking-wide">
                Visit This Sunday
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0">
          <div className="aspect-video w-full">
            {videoOpen && (
              <iframe
                src="https://www.youtube.com/embed/i8tajrzRqlk?start=38&autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}