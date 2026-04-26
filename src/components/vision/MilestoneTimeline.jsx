import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Upload, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';

const defaultMilestones = [
  { id: 'new_beginnings', title: 'New Beginnings', description: 'Young singles finding community, meeting, falling in love, and building families in faith.' },
  { id: 'growing_together', title: 'Growing Together', description: 'Young families navigating parenthood, raising children in the Gospel, and building rhythms of discipleship.' },
  { id: 'roots_legacy', title: 'Roots & Legacy', description: 'Established families stewarding their gifts, mentoring the next generation, and deepening their walk.' },
  { id: 'seasons_change', title: 'Seasons of Change', description: 'Empty nesters, retirees, those facing health challenges, grief, and the end of life — all equally worthy of pastoral care.' }
];

export default function MilestoneTimeline({ isAdmin }) {
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('milestone_images');
    if (saved) {
      try {
        const savedImages = JSON.parse(saved);
        return defaultMilestones.map(m => ({ ...m, image_url: savedImages[m.id] }));
      } catch (e) {
        return defaultMilestones;
      }
    }
    return defaultMilestones;
  });
  const [uploading, setUploading] = useState({});
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollLeft(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  const handleImageUpload = async (milestoneId, file) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [milestoneId]: true }));
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setMilestones(prev => {
        const updated = prev.map(m => m.id === milestoneId ? { ...m, image_url: result.file_url } : m);
        localStorage.setItem('milestone_images', JSON.stringify(
          Object.fromEntries(updated.map(m => [m.id, m.image_url]))
        ));
        return updated;
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(prev => ({ ...prev, [milestoneId]: false }));
  };

  const handleRemoveImage = (milestoneId) => {
    setMilestones(prev => {
      const updated = prev.map(m => m.id === milestoneId ? { ...m, image_url: null } : m);
      localStorage.setItem('milestone_images', JSON.stringify(
        Object.fromEntries(updated.map(m => [m.id, m.image_url]))
      ));
      return updated;
    });
  };

  return (
    <div className="py-12 mb-12">
      {/* Carousel Container */}
      <div className="relative">
        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex-shrink-0 min-w-0 w-full sm:w-96"
              >
                <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
                  <h3 className="font-heading text-lg text-primary mb-2">{milestone.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                    {milestone.description}
                  </p>

                  {/* Image upload area */}
                  <div className="mt-4">
                    {milestone.image_url ? (
                      <div className="relative group">
                        <img
                          src={milestone.image_url}
                          alt={milestone.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        {isAdmin && (
                          <button
                            onClick={() => handleRemoveImage(milestone.id)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(milestone.id, e.target.files?.[0])}
                          className="hidden"
                          disabled={!isAdmin || uploading[milestone.id]}
                        />
                        {isAdmin && (
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors bg-secondary/20">
                            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                            <p className="font-body text-xs text-muted-foreground">
                              {uploading[milestone.id] ? 'Uploading...' : 'Click to upload'}
                            </p>
                          </div>
                        )}
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollLeft}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}