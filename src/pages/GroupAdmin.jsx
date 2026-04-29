import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PendingRequestsPanel from '@/components/you/PendingRequestsPanel';

export default function GroupAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(me => {
      setUser(me);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Groups I lead (owner)
  const { data: myOwnedGroups = [] } = useQuery({
    queryKey: ['myOwnedGroups', user?.id],
    queryFn: () => base44.entities.CommunityGroup.filter({ owner_user_id: user.id }),
    enabled: !!user?.id,
  });

  // Pending requests for my owned groups
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequestsForMyGroups', myOwnedGroups.map(g => g.id)],
    queryFn: async () => {
      const all = await Promise.all(
        myOwnedGroups.map(g => base44.entities.GroupMembershipRequest.filter({ group_id: g.id, status: 'pending' }))
      );
      return all.flat();
    },
    enabled: myOwnedGroups.length > 0,
  });

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || myOwnedGroups.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/you">
            <Button variant="outline" size="sm" className="mb-6 font-body">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Profile
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground mb-4">You don't lead any groups.</p>
            <Link to="/you">
              <Button className="font-body">Return to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/you">
          <Button variant="outline" size="sm" className="mb-6 font-body">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Profile
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl text-primary mb-2">Group Admin</h1>
          <p className="font-body text-muted-foreground">Manage membership requests and expenses for your groups.</p>
        </motion.div>

        <PendingRequestsPanel
          ownedGroups={myOwnedGroups}
          pendingRequests={pendingRequests}
          isAdmin={false}
          user={user}
        />
      </div>
    </div>
  );
}