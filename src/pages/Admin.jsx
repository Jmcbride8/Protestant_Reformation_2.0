import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Trash2, Users, Mail, Calendar, HandCoins, ShieldCheck, Tv2, UserCheck } from 'lucide-react';
import AddNeedForm from '../components/admin/AddNeedForm';
import AddSermonForm from '../components/sermons/AddSermonForm';
import { toast } from "sonner";
import { useMutation } from '@tanstack/react-query';

const serviceLabels = {
  marriage_counseling: 'Marriage Counseling', parenting_support: 'Parenting Support',
  career_guidance: 'Career Guidance', wedding_inquiry: 'Wedding Inquiry',
  grief_support: 'Grief Support', general_prayer: 'Prayer Request',
  membership: 'Membership', other: 'General',
};

const statusColors = {
  new: 'bg-accent/10 text-accent', in_progress: 'bg-secondary text-secondary-foreground', resolved: 'bg-primary/10 text-primary',
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
      setLoading(false);
    });
  }, []);

  const { data: needs = [] } = useQuery({
    queryKey: ['adminNeeds'],
    queryFn: () => base44.entities.VolunteerNeed.list('-date', 50),
    enabled: !!user,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['adminContacts'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 50),
    enabled: !!user,
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['adminDonations'],
    queryFn: () => base44.entities.Donation.list('-created_date', 50),
    enabled: !!user,
  });

  const { data: signups = [] } = useQuery({
    queryKey: ['adminSignups'],
    queryFn: () => base44.entities.VolunteerSignup.list('-created_date', 100),
    enabled: !!user,
  });

  const { data: sermons = [] } = useQuery({
    queryKey: ['adminSermons'],
    queryFn: () => base44.entities.Sermon.list('-date', 50),
    enabled: !!user,
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['adminMemberships'],
    queryFn: () => base44.entities.MembershipRequest.list('-created_date', 100),
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-primary mb-2">Admin Access Required</h2>
          <p className="font-body text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          {!user && (
            <Button onClick={() => base44.auth.redirectToLogin()} className="font-body bg-primary">
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleDeleteNeed = async (id) => {
    await base44.entities.VolunteerNeed.delete(id);
    queryClient.invalidateQueries({ queryKey: ['adminNeeds'] });
    toast.success("Deleted");
  };

  const handleUpdateContactStatus = async (id, status) => {
    await base44.entities.ContactRequest.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
    toast.success("Status updated");
  };

  const handleUpdateMembershipStatus = async (id, status) => {
    await base44.entities.MembershipRequest.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['adminMemberships'] });
    toast.success("Membership status updated");
  };

  const membershipStatusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    waitlisted: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="font-heading text-3xl text-primary">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="volunteers" className="space-y-6">
          <TabsList className="bg-secondary font-body flex-wrap h-auto">
            <TabsTrigger value="volunteers" className="gap-2"><Calendar className="w-4 h-4" /> Volunteers</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2"><Mail className="w-4 h-4" /> Contacts</TabsTrigger>
            <TabsTrigger value="donations" className="gap-2"><HandCoins className="w-4 h-4" /> Donations</TabsTrigger>
            <TabsTrigger value="sermons" className="gap-2"><Tv2 className="w-4 h-4" /> Sermons</TabsTrigger>
            <TabsTrigger value="membership" className="gap-2">
              <UserCheck className="w-4 h-4" /> Membership
              {memberships.filter(m => m.status === 'pending').length > 0 && (
                <span className="ml-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {memberships.filter(m => m.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-8">
            <AddNeedForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['adminNeeds'] })} />
            
            <div>
              <h3 className="font-heading text-xl text-primary mb-4">All Volunteer Needs</h3>
              <div className="space-y-3">
                {needs.map(need => {
                  const needSignups = signups.filter(s => s.volunteer_need_id === need.id);
                  return (
                    <div key={need.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading text-base text-primary">{need.title}</h4>
                          <Badge variant="secondary" className="font-body text-xs">{need.status}</Badge>
                        </div>
                        <p className="font-body text-xs text-muted-foreground">
                          {format(new Date(need.date + 'T00:00:00'), 'MMM d, yyyy')} • {need.slots_filled || 0}/{need.slots_needed} filled
                        </p>
                        {needSignups.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="font-body text-xs text-muted-foreground">
                              {needSignups.map(s => s.volunteer_name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNeed(need.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
                {needs.length === 0 && (
                  <p className="font-body text-muted-foreground text-center py-8">No volunteer needs created yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="p-4 bg-card rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-heading text-base text-primary">{contact.name}</h4>
                      <p className="font-body text-xs text-muted-foreground">{contact.email} • {contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`font-body text-xs ${statusColors[contact.status] || ''}`}>
                        {contact.status}
                      </Badge>
                      <Badge variant="outline" className="font-body text-xs">
                        {serviceLabels[contact.service_type] || contact.service_type}
                      </Badge>
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-3">{contact.message}</p>
                  <div className="flex gap-2">
                    {['new', 'in_progress', 'resolved'].map(status => (
                      <Button 
                        key={status} 
                        variant={contact.status === status ? "default" : "outline"}
                        size="sm" 
                        className="font-body text-xs capitalize"
                        onClick={() => handleUpdateContactStatus(contact.id, status)}
                      >
                        {status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="font-body text-muted-foreground text-center py-8">No contact requests yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Sermons Tab */}
          <TabsContent value="sermons" className="space-y-8">
            <AddSermonForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['adminSermons'] })} />
            <div>
              <h3 className="font-heading text-xl text-primary mb-4">All Sermons</h3>
              <div className="space-y-3">
                {sermons.map(sermon => (
                  <div key={sermon.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-heading text-base text-primary">{sermon.title}</h4>
                        {sermon.is_featured && <Badge className="font-body text-xs bg-accent/10 text-accent border-0">Featured</Badge>}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">
                        {sermon.speaker} • {sermon.date}{sermon.series ? ` • ${sermon.series}` : ''}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={async () => { await base44.entities.Sermon.delete(sermon.id); queryClient.invalidateQueries({ queryKey: ['adminSermons'] }); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {sermons.length === 0 && <p className="font-body text-muted-foreground text-center py-8">No sermons added yet.</p>}
              </div>
            </div>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership">
            <div className="space-y-3">
              {memberships.map(app => (
                <div key={app.id} className="p-5 bg-card rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-heading text-base text-primary">{app.full_name}</h4>
                      <p className="font-body text-xs text-muted-foreground">
                        {app.email}{app.phone ? ` • ${app.phone}` : ''}
                        {app.how_long_attending ? ` • Attending ${app.how_long_attending}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${membershipStatusColors[app.status]}`}>
                        {app.status}
                      </span>
                      {app.baptized && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Baptized</span>
                      )}
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed border-l-2 border-border pl-3 italic">
                    "{app.testimony}"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'approved', 'waitlisted', 'declined'].map(status => (
                      <Button
                        key={status}
                        variant={app.status === status ? "default" : "outline"}
                        size="sm"
                        className="font-body text-xs capitalize"
                        onClick={() => handleUpdateMembershipStatus(app.id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {memberships.length === 0 && (
                <p className="font-body text-muted-foreground text-center py-8">No membership applications yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <div className="space-y-3">
              {donations.map(donation => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-heading text-base text-primary">{donation.donor_name}</h4>
                    <p className="font-body text-xs text-muted-foreground">
                      {donation.donor_email} • {format(new Date(donation.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg text-primary">${donation.amount?.toLocaleString()}</p>
                    <Badge variant="secondary" className="font-body text-xs capitalize">
                      {donation.fund?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
              {donations.length === 0 && (
                <p className="font-body text-muted-foreground text-center py-8">No donations yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}