import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors = {
  worship: 'bg-primary/10 text-primary',
  community: 'bg-accent/10 text-accent',
  celebration: 'bg-amber-100 text-amber-700',
  outreach: 'bg-green-100 text-green-700',
  youth: 'bg-blue-100 text-blue-700',
  family: 'bg-pink-100 text-pink-700',
  seasonal: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function Memories() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.filter({ is_active: true }, '-date'),
  });

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = url.split('/').pop() || 'memory';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isVideo = (url) => /\.(mp4|webm|mov)$/i.test(url);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Our Story</p>
          <h1 className="font-heading text-5xl text-primary mb-4">Church Memories</h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A year in photos and videos. Weddings, baptisms, celebrations, and the everyday joyful moments that make our church family alive. Download photos of your kids, your loved ones, and relive the seasons we've shared together.
          </p>
        </motion.div>

        {/* Memories Grid */}
        {memories.length > 0 ? (
          <div className="space-y-16">
            {memories.map((memory, idx) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-heading text-3xl text-primary">{memory.title}</h2>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[memory.category] || categoryColors.other}`}>
                        {memory.category}
                      </span>
                    </div>
                    {memory.description && (
                      <p className="font-body text-muted-foreground">{memory.description}</p>
                    )}
                    <p className="font-body text-sm text-muted-foreground/70 mt-2">
                      {new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memory.media_urls?.map((url, i) => (
                      <div key={i} className="group relative bg-secondary/50 rounded-xl overflow-hidden aspect-square cursor-pointer">
                        {isVideo(url) ? (
                          <>
                            <video
                              src={url}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={url}
                              alt={`${memory.title} photo`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onClick={() => setSelectedMedia(url)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="bg-primary/90 text-primary-foreground hover:bg-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(url);
                                }}
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="font-body text-lg text-muted-foreground">Coming soon — memories from our church family.</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full"
          >
            <img
              src={selectedMedia}
              alt="Memory detail"
              className="w-full rounded-xl"
            />
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Button
              variant="ghost"
              className="absolute bottom-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={() => handleDownload(selectedMedia)}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}