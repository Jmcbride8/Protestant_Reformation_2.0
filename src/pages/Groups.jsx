import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function Groups() {
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['communityGroups'],
    queryFn: () => base44.entities.CommunityGroup.list('sort_order', 50),
  });

  const activeGroups = groups.filter(g => g.is_active !== false);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Community</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              Better <span className="italic">Together</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Life is better together. Our community groups are where real friendships form, faith deepens, 
              and you find people who truly get what you're going through.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : activeGroups.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">Groups coming soon. Check back shortly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-accent/30 transition-all duration-300"
                >
                  {/* Leader Photo */}
                  <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                    {group.leader_photo_url ? (
                      <img
                        src={group.leader_photo_url}
                        alt={group.leader_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                    {group.tag && (
                      <div className="absolute top-4 left-4">
                        <span className="font-body text-xs tracking-wide px-3 py-1 rounded-full font-medium bg-primary text-primary-foreground">
                          {group.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-2xl text-primary mb-2">{group.name}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{group.description}</p>

                    {group.meeting_time && (
                      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="font-body text-sm">{group.meeting_time}</span>
                      </div>
                    )}

                    {/* Leader */}
                    <div className="border-t border-border/50 pt-4 mt-4">
                      <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">Led by</p>
                      <p className="font-heading text-base text-primary">{group.leader_name}</p>
                      {group.leader_title && (
                        <p className="font-body text-xs text-accent">{group.leader_title}</p>
                      )}
                      {group.leader_bio && (
                        <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{group.leader_bio}</p>
                      )}
                    </div>

                    <div className="mt-5">
                      <Link to="/contact">
                        <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80">
                          Join This Group <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}