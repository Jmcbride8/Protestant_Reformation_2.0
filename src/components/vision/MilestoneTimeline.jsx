import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const defaultMilestones = [
  { id: 'new_beginnings', title: 'New Beginnings', description: 'Young singles finding community, meeting, falling in love, and building families in faith.' },
  { id: 'growing_together', title: 'Growing Together', description: 'Young families navigating parenthood, raising children in the Gospel, and building rhythms of discipleship.' },
  { id: 'roots_legacy', title: 'Roots & Legacy', description: 'Established families stewarding their gifts, mentoring the next generation, and deepening their walk.' },
  { id: 'seasons_change', title: 'Seasons of Change', description: 'Empty nesters, retirees, those facing health challenges, grief, and the end of life — all equally worthy of pastoral care.' }
];

export default function MilestoneTimeline({ isAdmin }) {
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [uploading, setUploading] = useState({});

  const handleImageUpload = async (milestoneId, file) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [milestoneId]: true }));
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setMilestones(prev =>
        prev.map(m => m.id === milestoneId ? { ...m, image_url: result.file_url } : m)
      );
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(prev => ({ ...prev, [milestoneId]: false }));
  };

  const handleRemoveImage = (milestoneId) => {
    setMilestones(prev =>
      prev.map(m => m.id === milestoneId ? { ...m, image_url: null } : m)
    );
  };

  return (
    <div className="py-12 mb-12">
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent to-accent/30" />

        {/* Milestone cards */}
        <div className="space-y-16">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`flex items-start ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Content side */}
              <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
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
                              {uploading[milestone.id] ? 'Uploading...' : 'Click to upload image'}
                            </p>
                          </div>
                        )}
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="w-0 flex justify-center">
                <motion.div
                  whileInView={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  viewport={{ once: true }}
                  className="w-5 h-5 bg-accent rounded-full border-4 border-background z-10"
                />
              </div>

              {/* Spacer for alternate layout */}
              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}