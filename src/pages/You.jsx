import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import MyGroupSection from '@/components/you/MyGroupSection';
import DonationHistory from '@/components/you/DonationHistory';
import PendingRequestsPanel from '@/components/you/PendingRequestsPanel';
import EditProfilePanel from '@/components/you/EditProfilePanel';

export default function You() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    base44.auth.me().then(me => {
      setUser(me);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // My MemberProfile (matched by email)
  const { data: profiles = [] } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: () => base44.entities.MemberProfile.filter({ email: user.email }),
    enabled: !!user?.email,
  });
  const myProfile = profiles[0] || null;

  // My membership requests
  const { data: myRequests = [] } = useQuery({
    queryKey: ['myMembershipRequests', user?.id],
    queryFn: () => base44.entities.GroupMembershipRequest.filter({ requester_user_id: user.id }),
    enabled: !!user?.id,
  });

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

  // My donations
  const { data: myDonations = [] } = useQuery({
    queryKey: ['myDonations', user?.id],
    queryFn: () => base44.entities.Donation.filter({ donor_user_id: user.id }),
    enabled: !!user?.id,
  });

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-body text-muted-foreground mb-4">Please sign in to view your profile.</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>Sign In</Button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'staff';

  return (

    <div className="pt-20 min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 bg-secondary/30 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-accent/40 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                {myProfile?.photo_url ? (
                  <img src={myProfile.photo_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-14 h-14 text-primary/50" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-1">Your Profile</p>
                <h1 className="font-heading text-4xl sm:text-5xl text-primary">{user.full_name}</h1>
                <p className="font-body text-sm text-muted-foreground mt-1">{user.email}</p>
                {myProfile?.phone && (
                  <p className="font-body text-sm text-muted-foreground">{myProfile.phone}</p>
                )}
                {myProfile?.joined_date && (
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    <span className="text-foreground/60">Member since:</span> {new Date(myProfile.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {myProfile?.role && (
                    <span className="font-body text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {myProfile.role}
                    </span>
                  )}
                  <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => setEditing(e => !e)}>
                    <Pencil className="w-3 h-3 mr-1" /> {editing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button size="sm" variant="outline" className="font-body text-xs">
                        Admin Dashboard →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Panel */}
            {editing && (
              <EditProfilePanel
                profile={myProfile}
                user={user}
                onClose={() => setEditing(false)}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* --- SECTION 1: MY GROUP --- */}
        <MyGroupSection
          myProfile={myProfile}
          myRequests={myRequests}
          user={user}
        />

        {/* --- SECTION 2: PENDING REQUESTS (if I own a group) --- */}
        {(myOwnedGroups.length > 0 || isAdmin) && (
          <PendingRequestsPanel
            ownedGroups={myOwnedGroups}
            pendingRequests={pendingRequests}
            isAdmin={isAdmin}
          />
        )}

        {/* --- SECTION 3: DONATION HISTORY --- */}
        <DonationHistory donations={myDonations} />
      </div>
    </div>
  );
}