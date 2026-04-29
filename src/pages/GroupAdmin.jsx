import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, Settings } from 'lucide-react';
import PendingRequestsPanel from '@/components/you/PendingRequestsPanel';
import GroupFundSection from '@/components/giving/GroupFundSection';
import GroupSettingsForm from '@/components/admin/GroupSettingsForm';

export default function GroupAdmin() {
  const [user, setUser] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: ownedGroups = [] } = useQuery({
    queryKey: ['myOwnedGroups', user?.id],
    queryFn: () => base44.entities.CommunityGroup.filter({ owner_user_id: user.id }),
    enabled: !!user?.id,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequestsForMyGroups', ownedGroups.map(g => g.id)],
    queryFn: async () => {
      const all = await Promise.all(
        ownedGroups.map(g =>
          base44.entities.GroupMembershipRequest.filter({ group_id: g.id, status: 'pending' })
        )
      );
      return all.flat();
    },
    enabled: ownedGroups.length > 0,
  });

  const { data: myProfile } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: () => base44.entities.MemberProfile.filter({ email: user.email }).then(r => r[0] || null),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (ownedGroups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(ownedGroups[0].id);
    }
  }, [ownedGroups]);

  const selectedGroup = ownedGroups.find(g => g.id === selectedGroupId) || ownedGroups[0];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (ownedGroups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">You don't lead any groups.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-primary mb-1">Group Admin Console</h1>
        <p className="font-body text-muted-foreground text-sm">Manage your group, finances, and settings.</p>
      </div>

      {/* Group selector if multiple groups */}
      {ownedGroups.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {ownedGroups.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`font-body text-sm px-4 py-1.5 rounded-full border transition-colors ${
                selectedGroupId === g.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-secondary'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      <Tabs defaultValue="members">
        <TabsList className="mb-8">
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" /> Members
          </TabsTrigger>
          <TabsTrigger value="finances" className="gap-2">
            <DollarSign className="w-4 h-4" /> Finances
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" /> Group Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <PendingRequestsPanel
            ownedGroups={ownedGroups}
            pendingRequests={pendingRequests}
            isAdmin={false}
            myProfile={myProfile}
            user={user}
          />
        </TabsContent>

        <TabsContent value="finances">
          {selectedGroup && (
            <GroupFundSection group={selectedGroup} user={user} />
          )}
        </TabsContent>

        <TabsContent value="settings">
          {selectedGroup && (
            <GroupSettingsForm group={selectedGroup} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}