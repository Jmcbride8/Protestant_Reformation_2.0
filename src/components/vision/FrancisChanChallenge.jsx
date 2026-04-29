import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableText from './EditableText';

export default function FrancisChanChallenge({ isAdmin }) {
  const [youtubeId, setYoutubeId] = useState('8Gv1_92JS20');
  const [editingVideo, setEditingVideo] = useState(false);
  const [videoInput, setVideoInput] = useState('8Gv1_92JS20');

  useEffect(() => {
    const saved = localStorage.getItem('francis_youtube_id');
    if (saved) {
      setYoutubeId(saved);
      setVideoInput(saved);
    }
  }, []);

  const handleSaveVideo = () => {
    let id = videoInput;
    if (videoInput.includes('youtube.com')) {
      id = new URL(videoInput).searchParams.get('v');
    } else if (videoInput.includes('shorts/')) {
      id = videoInput.split('shorts/')[1]?.split('?')[0];
    }
    if (id) {
      localStorage.setItem('francis_youtube_id', id);
      setYoutubeId(id);
      setEditingVideo(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Challenge reflection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-accent/10 border border-accent/20 rounded-2xl p-10 text-center"
        >
          <h3 className="font-heading text-2xl text-primary mb-4">The Question for Us</h3>
          <EditableText
            storageKey="francis_challenge"
            defaultText="Could we build a church that could truly be a family, with real relationships at any stage — where regardless of the numbers, everyone was a name that someone knew."
            className="font-body text-lg text-muted-foreground italic leading-relaxed max-w-2xl mx-auto"
            isAdmin={isAdmin}
          />
        </motion.div>
      </div>
    </section>
  );
}