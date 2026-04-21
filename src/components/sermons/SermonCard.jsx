import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, BookOpen, CalendarDays, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function SermonCard({ sermon, index = 0 }) {
  const [open, setOpen] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${sermon.youtube_id}/maxresdefault.jpg`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07 }}
        className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
          <img
            src={thumbnailUrl}
            alt={sermon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${sermon.youtube_id}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-primary fill-primary ml-1" />
            </div>
          </div>
          {sermon.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-accent text-accent-foreground font-body text-xs">Featured</Badge>
            </div>
          )}
          {sermon.series && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-primary font-body text-xs">{sermon.series}</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3
            className="font-heading text-xl text-primary mb-2 cursor-pointer hover:text-accent transition-colors line-clamp-2"
            onClick={() => setOpen(true)}
          >
            {sermon.title}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="font-body text-xs">{sermon.speaker}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="font-body text-xs">{format(new Date(sermon.date + 'T00:00:00'), 'MMMM d, yyyy')}</span>
            </div>
            {sermon.scripture_reference && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-body text-xs italic">{sermon.scripture_reference}</span>
              </div>
            )}
          </div>

          {sermon.description && (
            <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {sermon.description}
            </p>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="p-0 h-auto font-body text-xs text-accent hover:text-accent/80"
            onClick={() => setOpen(true)}
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-accent" /> Watch Sermon
          </Button>
        </div>
      </motion.div>

      {/* Video Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-heading text-xl text-primary pr-8">{sermon.title}</DialogTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="font-body text-sm text-muted-foreground">{sermon.speaker}</span>
              <span className="font-body text-sm text-muted-foreground">
                {format(new Date(sermon.date + 'T00:00:00'), 'MMMM d, yyyy')}
              </span>
              {sermon.scripture_reference && (
                <span className="font-body text-sm italic text-accent">{sermon.scripture_reference}</span>
              )}
            </div>
          </DialogHeader>
          <div className="p-6 pt-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${sermon.youtube_id}`}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            {sermon.description && (
              <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">{sermon.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}