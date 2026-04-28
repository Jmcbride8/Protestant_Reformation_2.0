import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function MyGroupSection({ myProfile, myRequests, user }) {
  const approvedRequest = myRequests.find(r => r.status === 'approved');
  const pendingRequest = myRequests.find(r => r.status === 'pending');
  const rejectedRequest = myRequests.find(r => r.status === 'rejected');

  // Fetch group detail if we have an approved request or profile group
  const activeGroupId = myProfile?.small_group_id || approvedRequest?.group_id;
  const { data: groups = [] } = useQuery({
    queryKey: ['groupDetail', activeGroupId],
    queryFn: () => base44.entities.CommunityGroup.filter({ id: activeGroupId }),
    enabled: !!activeGroupId,
  });
  const myGroup = groups[0] || null;

  // Fetch pending group info
  const { data: pendingGroups = [] } = useQuery({
    queryKey: ['pendingGroupDetail', pendingRequest?.group_id],
    queryFn: () => base44.entities.CommunityGroup.filter({ id: pendingRequest.group_id }),
    enabled: !!pendingRequest?.group_id,
  });
  const pendingGroup = pendingGroups[0] || null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-2xl text-primary">My Group</h2>
      </div>

      {/* Enrolled in a group */}
      {myGroup ? (
        <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row gap-5">
          {myGroup.leader_photo_url && (
            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-secondary">
              <img src={myGroup.leader_photo_url} alt={myGroup.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-heading text-xl text-primary">{myGroup.name}</h3>
              <span className="font-body text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Member
              </span>
            </div>
            {myGroup.tag && (
              <p className="font-body text-xs text-accent mb-2">{myGroup.tag}</p>
            )}
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{myGroup.description}</p>
            {myGroup.meeting_time && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="font-body text-sm">{myGroup.meeting_time}</span>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="font-body text-xs text-muted-foreground">Led by <span className="text-foreground font-medium">{myGroup.leader_name}</span></p>
            </div>
          </div>
        </div>
      ) : pendingRequest ? (
        /* Pending request */
        <div className="bg-card border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-body text-sm font-medium text-foreground">Request Pending Approval</p>
              <p className="font-body text-xs text-muted-foreground">Your request to join <span className="font-medium text-foreground">{pendingRequest.group_name || pendingGroup?.name || 'this group'}</span> is awaiting review by the group leader.</p>
            </div>
          </div>
          {pendingGroup && (
            <div className="ml-12 text-xs font-body text-muted-foreground space-y-1">
              {pendingGroup.meeting_time && (
                <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{pendingGroup.meeting_time}</p>
              )}
              <p>Led by <span className="text-foreground">{pendingGroup.leader_name}</span></p>
            </div>
          )}
        </div>
      ) : (
        /* Not in a group */
        <div className="bg-secondary/40 border border-dashed border-border rounded-2xl p-8 text-center">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground text-sm">You're not in a group yet.</p>
          <p className="font-body text-muted-foreground/70 text-xs mt-1">Browse <a href="/groups" className="underline text-accent hover:text-accent/80">Community Groups</a> and request to join one.</p>
          {rejectedRequest && (
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-destructive/70">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>A previous request was not approved. You may apply to another group.</span>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}