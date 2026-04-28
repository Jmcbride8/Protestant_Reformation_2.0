import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Trash2, Users, Mail, Calendar, HandCoins, ShieldCheck, Tv2, UserCheck, PieChart, Pencil, BookOpen, UsersRound, Heart, ToggleLeft, Church, Eye, Kanban } from 'lucide-react';
import { startMemberPreview, startGuestPreview } from '../components/layout/MemberPreviewBanner';
import { useNavigate } from 'react-router-dom';
import FeatureTogglesManager from '../components/admin/FeatureTogglesManager';
import ChurchInfoManager from '../components/admin/ChurchInfoManager';
import BudgetManager from '../components/admin/BudgetManager';
import GivingManager from '../components/admin/GivingManager';
import FundsManager from '../components/admin/FundsManager';
import StaffKanban from '../components/admin/StaffKanban';
import BeliefsManager from '../components/admin/BeliefsManager';
import GroupsManager from '../components/admin/GroupsManager';
import ScheduleManager from '../components/admin/ScheduleManager';
import EventsManager from '../components/admin/EventsManager';
import MilestonesManager from '../components/admin/MilestonesManager';
import CarouselMembersManager from '../components/admin/CarouselMembersManager';
import AddNeedForm from '../components/admin/AddNeedForm';
import MemberDirectory from '../components/admin/MemberDirectory';
import AddSermonForm from '../components/sermons/AddSermonForm';
import MemoriesManager from '../components/admin/MemoriesManager';
import EditSermonModal from '../components/sermons/EditSermonModal';
import DonationMonthlyChart from '../components/admin/DonationMonthlyChart';
import DonationKPIs from '../components/admin/DonationKPIs';
import { Treemap, ResponsiveContainer } from 'recharts';
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
  const [editingSermon, setEditingSermon] = useState(null);
  const [adminSection, setAdminSection] = useState('website');
  const [donationFilters, setDonationFilters] = useState({ year: '', fund: '', donor: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handlePreviewAsMember = () => {
    startMemberPreview();
    navigate('/');
  };

  const handlePreviewAsGuest = () => {
    startGuestPreview();
    navigate('/');
  };

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

  const filteredDonations = donations.filter(d => {
    const donationYear = new Date(d.created_date).getFullYear().toString();
    const yearMatch = !donationFilters.year || donationYear === donationFilters.year;
    const fundMatch = !donationFilters.fund || d.fund === donationFilters.fund;
    const donorMatch = !donationFilters.donor || d.donor_name.toLowerCase().includes(donationFilters.donor.toLowerCase());
    return yearMatch && fundMatch && donorMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-primary mb-2">Access Required</h2>
          <p className="font-body text-muted-foreground mb-6">You need admin or staff privileges to access this page.</p>
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

  const handleUpdateMembershipStatus = async (app, status) => {
    await base44.entities.MembershipRequest.update(app.id, { status });
    if (status === 'approved') {
      // Check if a MemberProfile already exists for this application
      const existing = await base44.entities.MemberProfile.filter({ membership_request_id: app.id });
      if (!existing || existing.length === 0) {
        await base44.entities.MemberProfile.create({
          membership_request_id: app.id,
          full_name: app.full_name,
          email: app.email,
          phone: app.phone || '',
          baptized: app.baptized || false,
          role: app.member_role || 'Member',
          joined_date: new Date().toISOString().split('T')[0],
          is_directory_visible: true,
        });
      }
    }
    queryClient.invalidateQueries({ queryKey: ['adminMemberships'] });
    queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
    toast.success(status === 'approved' ? 'Member approved and added to directory' : 'Status updated');
  };

  const membershipStatusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    waitlisted: 'bg-blue-100 text-blue-700',
  };


  const sidebarSections = [
    { key: 'website', label: 'Website', icon: Tv2 },
    { key: 'church', label: 'Church', icon: Users },
    { key: 'actions', label: 'Actions', icon: Kanban },
    { key: 'config', label: 'Settings', icon: ToggleLeft },
  ];

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-3xl text-primary">Admin Console</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handlePreviewAsGuest} size="sm" className="font-body gap-2 border-muted-foreground text-muted-foreground hover:bg-muted">
              <Eye className="w-3.5 h-3.5" /> Preview as Guest
            </Button>
            <Button variant="outline" onClick={handlePreviewAsMember} size="sm" className="font-body gap-2 border-accent text-accent hover:bg-accent/10">
              <Eye className="w-3.5 h-3.5" /> Preview as Member
            </Button>
          </div>
        </div>

        {/* Section selector */}
        <div className="mb-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 bg-secondary/30 border-b-2 border-border shadow-sm">
          <div className="flex flex-wrap gap-2">
            {sidebarSections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setAdminSection(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm transition-all whitespace-nowrap ${
                  adminSection === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

          {/* Content */}
          <div className="min-w-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">

        {/* Website Administration Section */}
        {adminSection === 'website' && (
        <Tabs defaultValue="sermons" className="space-y-6">
          <TabsList className="bg-secondary/30 font-body flex-wrap h-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b-2 border-border rounded-none shadow-sm">
            <TabsTrigger value="sermons" className="gap-2"><Tv2 className="w-4 h-4" /> Sermons</TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2"><Calendar className="w-4 h-4" /> Schedule</TabsTrigger>
            <TabsTrigger value="milestones" className="gap-2"><Heart className="w-4 h-4" /> Milestones</TabsTrigger>
            <TabsTrigger value="groups" className="gap-2"><UsersRound className="w-4 h-4" /> Groups</TabsTrigger>
            <TabsTrigger value="beliefs" className="gap-2"><BookOpen className="w-4 h-4" /> Beliefs</TabsTrigger>
            <TabsTrigger value="events" className="gap-2"><Calendar className="w-4 h-4" /> Events</TabsTrigger>
            <TabsTrigger value="carousel" className="gap-2"><Users className="w-4 h-4" /> Who You'll Meet</TabsTrigger>
            <TabsTrigger value="memories" className="gap-2"><Users className="w-4 h-4" /> Memories</TabsTrigger>
            </TabsList>

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
                        {sermon.is_featured && <Badge className="bg-accent/20 text-accent font-body text-xs">Featured</Badge>}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">
                        By {sermon.speaker} • {format(new Date(sermon.date + 'T00:00:00'), 'MMM d, yyyy')}
                      </p>
                      {sermon.series && (
                        <p className="font-body text-xs text-muted-foreground mt-1">Series: {sermon.series}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingSermon(sermon)}>
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={async () => {
                        await base44.entities.Sermon.delete(sermon.id);
                        queryClient.invalidateQueries({ queryKey: ['adminSermons'] });
                        toast.success("Sermon deleted");
                      }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {sermons.length === 0 && (
                  <p className="font-body text-muted-foreground text-center py-8">No sermons added yet.</p>
                )}
              </div>
            </div>
            {editingSermon && (
              <EditSermonModal 
                sermon={editingSermon} 
                onClose={() => setEditingSermon(null)}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ['adminSermons'] });
                  setEditingSermon(null);
                }}
              />
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <ScheduleManager />
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <MilestonesManager />
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <GroupsManager />
          </TabsContent>

          {/* Beliefs Tab */}
          <TabsContent value="beliefs">
            <BeliefsManager />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          {/* Carousel Tab */}
          <TabsContent value="carousel">
            <CarouselMembersManager />
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories">
            <MemoriesManager />
          </TabsContent>

          </Tabs>
        )}

        {/* Actions Section */}
        {adminSection === 'actions' && (
          <StaffKanban />
        )}

        {/* Configuration Section */}
        {adminSection === 'config' && (
        <Tabs defaultValue="church_info" className="space-y-6">
          <TabsList className="bg-secondary/30 font-body flex-wrap h-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b-2 border-border rounded-none shadow-sm">
            <TabsTrigger value="church_info" className="gap-2"><Church className="w-4 h-4" /> Church Info</TabsTrigger>
            <TabsTrigger value="features" className="gap-2"><ToggleLeft className="w-4 h-4" /> Feature Toggles</TabsTrigger>
          </TabsList>

          <TabsContent value="church_info">
            <ChurchInfoManager />
          </TabsContent>

          <TabsContent value="features">
            <FeatureTogglesManager />
          </TabsContent>
        </Tabs>
        )}

        {/* Church Administration Section */}
        {adminSection === 'church' && (
        <Tabs defaultValue="volunteers" className="space-y-6">
          <TabsList className="bg-secondary/30 font-body flex-wrap h-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b-2 border-border rounded-none shadow-sm">
            <TabsTrigger value="volunteers" className="gap-2"><Calendar className="w-4 h-4" /> Volunteer Needs</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2"><Mail className="w-4 h-4" /> Contacts</TabsTrigger>
            <TabsTrigger value="directory" className="gap-2"><Users className="w-4 h-4" /> Member Directory</TabsTrigger>
            <TabsTrigger value="membership" className="gap-2">
              <UserCheck className="w-4 h-4" /> Membership
              {memberships.filter(m => m.status === 'pending').length > 0 && (
                <span className="ml-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {memberships.filter(m => m.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2"><HandCoins className="w-4 h-4" /> Donations</TabsTrigger>
            <TabsTrigger value="budget" className="gap-2"><PieChart className="w-4 h-4" /> Budget</TabsTrigger>
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
          <TabsContent value="contacts" className="space-y-8">
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



          {/* Member Directory Tab */}
          <TabsContent value="directory">
            <MemberDirectory />
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership">
            <div className="space-y-3">
              {memberships.filter(m => m.status !== 'approved').map(app => (
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
                  <div className="flex flex-wrap gap-2 items-center">
                    {['pending', 'approved', 'waitlisted', 'declined'].map(status => (
                      <Button
                        key={status}
                        variant={app.status === status ? "default" : "outline"}
                        size="sm"
                        className="font-body text-xs capitalize"
                        onClick={() => handleUpdateMembershipStatus(app, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {memberships.filter(m => m.status !== 'approved').length === 0 && (
                <p className="font-body text-muted-foreground text-center py-8">No pending applications.</p>
              )}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <div className="space-y-6">
              <DonationKPIs donations={filteredDonations} />
              <DonationMonthlyChart donations={filteredDonations} />

              <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-1">Year</label>
                  <select 
                    onChange={(e) => setDonationFilters(prev => ({ ...prev, year: e.target.value }))} 
                    value={donationFilters.year}
                    className="font-body text-sm px-3 py-1.5 rounded border border-input bg-background"
                  >
                    <option value="">All Years</option>
                    {[...new Set(donations.map(d => new Date(d.created_date).getFullYear()))].sort((a,b) => b-a).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-1">Fund</label>
                  <select 
                    onChange={(e) => setDonationFilters(prev => ({ ...prev, fund: e.target.value }))} 
                    value={donationFilters.fund}
                    className="font-body text-sm px-3 py-1.5 rounded border border-input bg-background"
                  >
                    <option value="">All Funds</option>
                    {['general', 'building_campaign', 'missions', 'youth', 'community_meals'].map(fund => (
                      <option key={fund} value={fund}>{fund.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="font-body text-sm text-muted-foreground block mb-1">Donor Name</label>
                  <input 
                    type="text"
                    onChange={(e) => setDonationFilters(prev => ({ ...prev, donor: e.target.value }))} 
                    value={donationFilters.donor}
                    placeholder="Search donor..."
                    className="font-body text-sm px-3 py-1.5 rounded border border-input bg-background w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredDonations.map(donation => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                    <div>
                      <h4 className="font-heading text-base text-primary">{donation.donor_name}</h4>
                      <p className="font-body text-xs text-muted-foreground">
                        {donation.donor_email} • {format(new Date(donation.donation_date + 'T00:00:00'), 'MMM d, yyyy')}
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
                {filteredDonations.length === 0 && (
                  <p className="font-body text-muted-foreground text-center py-8">No donations matching filters.</p>
                )}
              </div>

              {filteredDonations.length > 0 && (
                <div className="mt-6 p-4 bg-secondary rounded-lg border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-lg text-primary">Total Donations</span>
                    <span className="font-heading text-2xl text-primary">${filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-2">{filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''}</p>
                </div>
              )}

              {filteredDonations.length > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Donations by Donor</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <Treemap
                      data={filteredDonations.reduce((acc, d) => {
                        const existing = acc.find(item => item.name === d.donor_name);
                        if (existing) {
                          existing.value += d.amount || 0;
                        } else {
                          acc.push({ name: d.donor_name, value: d.amount || 0 });
                        }
                        return acc;
                      }, []).sort((a, b) => b.value - a.value)}
                      dataKey="value"
                      stroke="#fff"
                      fill="hsl(var(--primary))"
                    >
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              )}
              </div>
              </div>
              </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-10">
            <FundsManager />
            <GivingManager />
            <BudgetManager />
          </TabsContent>
        </Tabs>
        )}

        </div>{/* end content */}
        </div>
        </div>
        );
        }