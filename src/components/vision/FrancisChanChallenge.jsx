import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableText from './EditableText';

export default function FrancisChanChallenge({ isAdmin }) {
  const [youtubeId, setYoutubeId] = useState('P5GD9ftscFQ');
  const [editingVideo, setEditingVideo] = useState(false);
  const [videoInput, setVideoInput] = useState('P5GD9ftscFQ');

  useEffect(() => {
    const saved = localStorage.getItem('francis_youtube_id');
    if (saved) {
      setYoutubeId(saved);
      setVideoInput(saved);
    }
  }, []);

  const handleSaveVideo = () => {
    const id = videoInput.includes('youtube.com') 
      ? new URL(videoInput).searchParams.get('v') 
      : videoInput;
    if (id) {
      localStorage.setItem('francis_youtube_id', id);
      setYoutubeId(id);
      setEditingVideo(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">From the Megachurch to the Margin</p>
          <h2 className="font-heading text-4xl text-primary mb-5">The Francis Chan Challenge</h2>
          <EditableText
            storageKey="francis_intro"
            defaultText="Francis Chan walked away from a thriving megachurch to ask a harder question: What if the church looked less like an organization and more like a family? He abandoned the stage, the crowds, and the comfort to return to something ancient and radical — a church small enough to know people's names, brave enough to live generously, and faithful enough to make disciples, not just decisions."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Video and text layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            {editingVideo ? (
              <div className="space-y-3 p-6 bg-secondary rounded-2xl">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="YouTube URL or video ID"
                  className="w-full px-3 py-2 border border-border rounded-lg font-body text-sm"
                />
                <p className="text-xs text-muted-foreground">Paste a YouTube URL or video ID (e.g., P5GD9ftscFQ)</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveVideo} className="gap-1">
                    <Check className="w-4 h-4" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditingVideo(false);
                    setVideoInput(youtubeId);
                  }} className="gap-1">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/30">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?si=OrPiuXXfWWbSEBA7`}
                  title="Francis Chan Challenge"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0"
                />
                {isAdmin && (
                  <button
                    onClick={() => setEditingVideo(true)}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-heading text-2xl text-primary mb-3">Why He Left</h3>
              <EditableText
                storageKey="francis_why_left"
                defaultText="Cornerstone Church had grown to thousands. Francis had influence, platform, and success by every measure. But he couldn't shake a conviction: the New Testament describes churches that were small, personal, and radically generous. He was leading a machine. He wanted to lead a family."
                className="font-body text-muted-foreground leading-relaxed"
                isAdmin={isAdmin}
              />
            </div>

            <div>
              <h3 className="font-heading text-2xl text-primary mb-3">The Call to Action</h3>
              <EditableText
                storageKey="francis_call"
                defaultText="What if your church wasn't measured by attendance, budget, or programs — but by whether your members actually know each other? Whether they carry each other's burdens? Whether a single mom down the street feels like she has a family? That's the challenge Francis lives. That's what we're building toward."
                className="font-body text-muted-foreground leading-relaxed"
                isAdmin={isAdmin}
              />
            </div>

            <Button
              variant="default"
              className="font-body gap-2 mt-4"
              asChild
            >
              <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4" />
                Watch the Full Talk
              </a>
            </Button>
          </motion.div>
        </div>

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