import React from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, XCircle, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function PendingRequestsPanel({ ownedGroups, pendingRequests, isAdmin }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateRequest = useMutation({
    mutationFn: ({ id, status }) => base44.entities.GroupMembershipRequest.update(id, { status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequestsForMyGroups'] });
      toast({ title: status === 'approved' ? 'Request approved!' : 'Request rejected.' });
    },
  });

  const groupName = (groupId) => {
    const g = ownedGroups.find(g => g.id === groupId);
    return g?.name || 'Group';
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-2xl text-primary">
          {isAdmin ? 'Group Management' : 'My Group — Pending Requests'}
        </h2>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No pending membership requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map(req => (
            <div key={req.id} className="bg-card border border-border/50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary/60" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{req.requester_name || req.requester_email || 'Member'}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Requesting to join <span className="font-medium">{req.group_name || groupName(req.group_id)}</span>
                    {req.created_date && <span> · {format(new Date(req.created_date), 'MMM d')}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
                  onClick={() => updateRequest.mutate({ id: req.id, status: 'rejected' })}
                  disabled={updateRequest.isPending}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-primary"
                  onClick={() => updateRequest.mutate({ id: req.id, status: 'approved' })}
                  disabled={updateRequest.isPending}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}