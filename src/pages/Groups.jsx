import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function Groups() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['communityGroups'],
    queryFn: () => base44.entities.CommunityGroup.list('sort_order', 50),
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ['myMembershipRequests', user?.id],
    queryFn: () => base44.entities.GroupMembershipRequest.filter({ requester_user_id: user.id }),
    enabled: !!user?.id,
  });

  const { data: myProfiles = [] } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: () => base44.entities.MemberProfile.filter({ email: user.email }),
    enabled: !!user?.email,
  });
  const myProfile = myProfiles[0] || null;

  const requestJoin = useMutation({
    mutationFn: ({ group }) =>
      base44.entities.GroupMembershipRequest.create({
        group_id: group.id,
        group_name: group.name,
        requester_user_id: user.id,
        requester_name: user.full_name,
        requester_email: user.email,
        member_profile_id: myProfile?.id || '',
        status: 'pending',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMembershipRequests'] });
      toast({ title: 'Request sent!', description: 'The group leader will review your request.' });
    },
  });

  const activeGroups = groups.filter(g => g.is_active !== false);

  const getGroupStatus = (groupId) => {
    if (myProfile?.small_group_id === groupId) return 'member';
    const req = myRequests.find(r => r.group_id === groupId);
    if (!req) return 'none';
    return req.status; // 'pending', 'approved', 'rejected'
  };

  const hasActiveGroup = !!myProfile?.small_group_id || myRequests.some(r => r.status === 'pending' || r.status === 'approved');

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
              {activeGroups.map((group, index) => {
                const status = user ? getGroupStatus(group.id) : 'none';
                return (
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
                        <img src={group.leader_photo_url} alt={group.leader_name} className="w-full h-full object-cover" />
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
                      </div>

                      {/* Join Action */}
                      <div className="mt-5">
                        {!user ? (
                          <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80" onClick={() => base44.auth.redirectToLogin()}>
                            Sign in to Join →
                          </Button>
                        ) : status === 'member' || status === 'approved' ? (
                          <span className="inline-flex items-center gap-1.5 font-body text-sm text-green-700">
                            <CheckCircle2 className="w-4 h-4" /> You're a member
                          </span>
                        ) : status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 font-body text-sm text-amber-600">
                            <Clock3 className="w-4 h-4" /> Request pending
                          </span>
                        ) : status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1.5 font-body text-sm text-destructive/70">
                            <XCircle className="w-4 h-4" /> Request not approved
                          </span>
                        ) : hasActiveGroup ? (
                          <span className="font-body text-xs text-muted-foreground italic">You're already in a group</span>
                        ) : (
                          <Button
                            variant="ghost"
                            className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80"
                            onClick={() => requestJoin.mutate({ group })}
                            disabled={requestJoin.isPending}
                          >
                            Request to Join →
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}