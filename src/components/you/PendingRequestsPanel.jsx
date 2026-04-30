import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, XCircle, User, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import GiveToGroupMemberModal from '@/components/giving/GiveToGroupMemberModal';

export default function PendingRequestsPanel({ ownedGroups, pendingRequests, isAdmin, myProfile, user }) {
   const [giveTarget, setGiveTarget] = useState(null);
   const queryClient = useQueryClient();

   // Fetch group members for leaders (for giving section)
     const { data: groupMembers = [] } = useQuery({
       queryKey: ['groupMembersForGiving', ownedGroups],
       queryFn: async () => {
         const allMembers = [];
         for (const group of ownedGroups) {
           const members = await base44.entities.MemberProfile.filter({ small_group_id: group.id });
           allMembers.push(...members.map(m => ({ ...m, group_id: group.id, group_name: group.name })));
         }
         return allMembers;
       },
       enabled: ownedGroups.length > 0,
     });

     // Fetch pending expense requests for owned groups
     const { data: pendingExpenses = [] } = useQuery({
       queryKey: ['pendingExpensesForMyGroups', ownedGroups.map(g => g.id)],
       queryFn: async () => {
         const all = await Promise.all(
           ownedGroups.map(g => 
             base44.entities.GroupFundTransaction.list().then(txs => 
               txs.filter(tx => tx.group_id === g.id && tx.status === 'pending' && tx.type === 'spent')
             )
           )
         );
         return all.flat();
       },
       enabled: ownedGroups.length > 0,
     });

  const updateRequest = useMutation({
     mutationFn: async ({ id, status, req }) => {
       await base44.entities.GroupMembershipRequest.update(id, { status });
       if (status === 'approved' && req) {
         // Also update the member's MemberProfile to assign them to the group
         const profiles = await base44.entities.MemberProfile.filter({ email: req.requester_email });
         if (profiles.length > 0) {
           await base44.entities.MemberProfile.update(profiles[0].id, {
             small_group_id: req.group_id,
             small_group_name: req.group_name,
           });
         }
       }
     },
     onSuccess: (_, { status }) => {
       queryClient.invalidateQueries({ queryKey: ['pendingRequestsForMyGroups'] });
       queryClient.invalidateQueries({ queryKey: ['myProfile'] });
       queryClient.invalidateQueries({ queryKey: ['groupMembersForGiving'] });
       toast(status === 'approved' ? 'Request approved — member added to group!' : 'Request rejected.');
     },
   });

   const approveExpense = useMutation({
     mutationFn: ({ id }) => base44.entities.GroupFundTransaction.update(id, { status: 'approved', approved_by: user?.full_name || user?.email || 'Leader' }),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['pendingExpensesForMyGroups'] });
       queryClient.invalidateQueries({ queryKey: ['groupFundTx'] });
       toast.success('Expense approved!');
     },
   });

   const rejectExpense = useMutation({
     mutationFn: ({ id }) => base44.entities.GroupFundTransaction.update(id, { status: 'rejected' }),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['pendingExpensesForMyGroups'] });
       toast.error('Expense rejected.');
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

      {/* MEMBERSHIP REQUESTS */}
      {pendingRequests.length === 0 ? (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No pending membership requests.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
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
                  onClick={() => updateRequest.mutate({ id: req.id, status: 'rejected', req })}
                  disabled={updateRequest.isPending}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-primary"
                  onClick={() => updateRequest.mutate({ id: req.id, status: 'approved', req })}
                  disabled={updateRequest.isPending}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}
          </div>
          )}

          {/* EXPENSE REQUESTS */}
          {pendingExpenses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-accent" />
                <h3 className="font-heading text-lg text-primary">Pending Expense Approvals</h3>
              </div>
              <div className="space-y-3">
                {pendingExpenses.map(expense => (
                  <div key={expense.id} className="bg-card border border-border/50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">{expense.description}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          <span className="font-medium">${(expense.amount || 0).toLocaleString()}</span> · {expense.group_name}
                          {expense.transaction_date && <span> · {format(new Date(expense.transaction_date), 'MMM d')}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
                        onClick={() => rejectExpense.mutate({ id: expense.id })}
                        disabled={rejectExpense.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-primary"
                        onClick={() => approveExpense.mutate({ id: expense.id })}
                        disabled={approveExpense.isPending}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Give from Church Fund - shown if user owns groups and has members */}
          {ownedGroups.length > 0 && groupMembers.length > 0 && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 mt-6">
          <p className="font-body text-xs tracking-[0.18em] uppercase text-accent mb-3">Give from Church Fund</p>
          <div className="flex flex-wrap gap-2">
            {groupMembers.map(member => (
              <button
                key={member.id}
                onClick={() => setGiveTarget(member)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background hover:bg-secondary hover:border-accent transition-colors font-body text-sm"
              >
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">{member.full_name?.[0]}</div>
                )}
                {member.full_name}
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-2">Select a member to record a church fund gift on their behalf.</p>
          </div>
          )}

          {giveTarget && (
          <GiveToGroupMemberModal
          member={giveTarget}
          group={ownedGroups.find(g => g.id === giveTarget.group_id)}
          user={user}
          onClose={() => setGiveTarget(null)}
          />
          )}
          </motion.section>
          );
          }