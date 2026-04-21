import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Tv2 } from 'lucide-react';
import SermonCard from '../components/sermons/SermonCard';
import BeliefsSection from '../components/sermons/BeliefsSection';

export default function Sermons() {
  const [search, setSearch] = useState('');
  const [activeSeries, setActiveSeries] = useState('All');

  const { data: sermons = [], isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: () => base44.entities.Sermon.list('-date', 50),
  });

  const series = useMemo(() => {
    const s = new Set(sermons.map(s => s.series).filter(Boolean));
    return ['All', ...Array.from(s)];
  }, [sermons]);

  const featuredSermon = sermons.find(s => s.is_featured);

  const filteredSermons = useMemo(() => {
    return sermons.filter(s => {
      const matchesSeries = activeSeries === 'All' || s.series === activeSeries;
      const matchesSearch = !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.speaker.toLowerCase().includes(search.toLowerCase()) ||
        (s.series && s.series.toLowerCase().includes(search.toLowerCase())) ||
        (s.scripture_reference && s.scripture_reference.toLowerCase().includes(search.toLowerCase()));
      return matchesSeries && matchesSearch;
    });
  }, [sermons, activeSeries, search]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">The Word</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Sermons & <span className="italic">Beliefs</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Watch past services, explore our sermon archive, and discover the core convictions 
              that shape everything we do at Hope Church Santa Barbara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Sermon */}
      {featuredSermon && (
        <section className="py-16 bg-primary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-6 text-center">Latest Message</p>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => {/* handled by SermonCard's internal dialog */}}>
                <FeaturedPlayer sermon={featuredSermon} />
              </div>
              <div className="lg:col-span-2 text-primary-foreground">
                {featuredSermon.series && (
                  <Badge className="bg-accent text-accent-foreground font-body text-xs mb-3">{featuredSermon.series}</Badge>
                )}
                <h2 className="font-heading text-3xl mb-3">{featuredSermon.title}</h2>
                {featuredSermon.scripture_reference && (
                  <p className="font-body text-sm italic text-primary-foreground/70 mb-2">{featuredSermon.scripture_reference}</p>
                )}
                <p className="font-body text-sm text-primary-foreground/70 mb-4">{featuredSermon.speaker}</p>
                {featuredSermon.description && (
                  <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">{featuredSermon.description}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sermon Archive */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sermons…"
                className="pl-9 font-body"
              />
            </div>
            {series.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {series.map(s => (
                  <Button
                    key={s}
                    variant={activeSeries === s ? "default" : "outline"}
                    size="sm"
                    className="font-body text-xs"
                    onClick={() => setActiveSeries(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl bg-secondary animate-pulse aspect-[4/3]" />
              ))}
            </div>
          ) : filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSermons.map((sermon, index) => (
                <SermonCard key={sermon.id} sermon={sermon} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Tv2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">No sermons found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Beliefs */}
      <BeliefsSection />
    </div>
  );
}

// Inline featured player to keep clean separation
function FeaturedPlayer({ sermon }) {
  const [playing, setPlaying] = React.useState(false);
  const thumbnail = `https://img.youtube.com/vi/${sermon.youtube_id}/maxresdefault.jpg`;

  if (playing) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${sermon.youtube_id}`}
        title={sermon.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full absolute inset-0"
      />
    );
  }

  return (
    <div className="relative w-full h-full" onClick={() => setPlaying(true)}>
      <img
        src={thumbnail}
        alt={sermon.title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${sermon.youtube_id}/hqdefault.jpg`; }}
      />
      <div className="absolute inset-0 bg-primary/30 hover:bg-primary/20 transition-colors flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-9 h-9 text-primary fill-primary ml-1.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}