import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, HandHeart, Plus, X, Car, UtensilsCrossed, BookOpen, HandCoins, Baby, Wrench, Smile, HelpCircle, Lock, Trash2, Pencil, Users } from 'lucide-react';
import { toast } from 'sonner';
import GiveToMemberModal from '@/components/community/GiveToMemberModal';

const CATEGORIES = [
  { value: 'rides', label: 'Rides & Transport', icon: Car },
  { value: 'meals', label: 'Meals', icon: UtensilsCrossed },
  { value: 'prayer', label: 'Prayer', icon: BookOpen },
  { value: 'financial', label: 'Financial Help', icon: HandCoins },
  { value: 'childcare', label: 'Childcare', icon: Baby },
  { value: 'skills', label: 'Skills & Tasks', icon: Wrench },
  { value: 'emotional_support', label: 'Emotional Support', icon: Smile },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

const CATEGORY_COLORS = {
  rides: 'bg-blue-100 text-blue-700',
  meals: 'bg-orange-100 text-orange-700',
  prayer: 'bg-purple-100 text-purple-700',
  financial: 'bg-green-100 text-green-700',
  childcare: 'bg-pink-100 text-pink-700',
  skills: 'bg-yellow-100 text-yellow-700',
  emotional_support: 'bg-rose-100 text-rose-700',
  other: 'bg-gray-100 text-gray-700',
};

function PostCard({ post, user, onDelete, onEdit, onGive }) {
  const cat = CATEGORIES.find(c => c.value === post.category);
  const Icon = cat?.icon || HelpCircle;
  const isOffer = post.type === 'offer';
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.email && post.created_by === user.email;
  const canDelete = isAdmin || isOwner;
  const canEdit = isOwner;
  const isFinancial = post.category === 'financial' && post.type === 'request';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border/50 p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.other}`}>
            <Icon className="w-3 h-3" />
            {cat?.label || post.category}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOffer ? 'bg-accent/20 text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {isOffer ? 'Offering Help' : 'Seeking Help'}
          </span>
          {post.group_name && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              <Users className="w-3 h-3" />
              {post.group_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {post.status !== 'open' && (
            <span className="text-xs text-muted-foreground italic mr-1">{post.status}</span>
          )}
          {canEdit && (
            <button onClick={() => onEdit(post)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Edit post">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(post)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete post">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <h4 className="font-heading text-lg text-primary leading-snug">{post.title}</h4>
      <p className="font-body text-sm text-muted-foreground leading-relaxed">{post.description}</p>
      <div className="border-t pt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground font-body">
          Posted by <span className="text-foreground font-medium">{post.is_anonymous ? 'Anonymous' : (post.contact_name || 'A member')}</span>
          {!post.is_anonymous && post.contact_email && (
            <> · <a href={`mailto:${post.contact_email}`} className="text-accent hover:underline">{post.contact_email}</a></>
          )}
        </p>
        {isFinancial && (
          <Button
            size="sm"
            variant="outline"
            className="font-body text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50 shrink-0"
            onClick={() => onGive(post)}
          >
            <HandCoins className="w-3.5 h-3.5" />
            Give
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function PostForm({ user, groups, memberGroupId, post, onClose, onSuccess, isEdit }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(post ? {
    title: post.title,
    description: post.description,
    category: post.category,
    type: post.type,
    contact_name: post.contact_name || '',
    contact_email: post.contact_email || '',
    is_anonymous: post.is_anonymous || false,
    group_id: post.group_id || '',
    group_name: post.group_name || '',
  } : {
    type: 'request',
    category: '',
    title: '',
    description: '',
    contact_name: user?.full_name || '',
    contact_email: user?.email || '',
    is_anonymous: false,
    group_id: memberGroupId || '',
    group_name: groups.find(g => g.id === memberGroupId)?.name || '',
  });

  const handleGroupChange = (id) => {
    const group = groups.find(g => g.id === id);
    setForm(f => ({ ...f, group_id: id, group_name: group?.name || '' }));
  };

  const mutation = useMutation({
    mutationFn: (data) => isEdit
      ? base44.entities.CommunitySupport.update(post.id, data)
      : base44.entities.CommunitySupport.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communitySupport'] });
      toast.success(isEdit ? "Post updated." : "Your post has been shared with the community!");
      onSuccess?.();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const inner = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        {['request', 'offer'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setForm(f => ({ ...f, type: t }))}
            className={`flex-1 py-2 rounded-lg border text-sm font-body font-medium transition-colors ${form.type === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
          >
            {t === 'request' ? '🙏 I need help' : '🤝 I can help'}
          </button>
        ))}
      </div>

      {/* Group selector */}
      <div className="space-y-1">
        <Label className="font-body text-sm">Post to Group</Label>
        <Select value={form.group_id} onValueChange={handleGroupChange}>
          <SelectTrigger className="font-body"><SelectValue placeholder="Select a group (optional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Community (no specific group)</SelectItem>
            {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-body text-sm">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger className="font-body"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-body text-sm">Short Title</Label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Need a ride to chemo" required className="font-body" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="font-body text-sm">Details</Label>
        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what you need or what you're offering..." required className="font-body h-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-body text-sm">Your Name</Label>
          <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Your name" className="font-body" />
        </div>
        <div className="space-y-1">
          <Label className="font-body text-sm">Contact Email</Label>
          <Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="your@email.com" className="font-body" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm(f => ({ ...f, is_anonymous: e.target.checked }))} className="rounded" />
        <span className="font-body text-sm text-muted-foreground">Post anonymously (only admins will see your name)</span>
      </label>
      <div className="flex gap-3">
        {isEdit && <Button type="button" variant="outline" className="flex-1 font-body" onClick={onClose}>Cancel</Button>}
        <Button type="submit" disabled={mutation.isPending} className={`font-body bg-primary hover:bg-primary/90 ${isEdit ? 'flex-1' : 'w-full'}`}>
          {mutation.isPending ? (isEdit ? 'Saving...' : 'Posting...') : (isEdit ? 'Save Changes' : 'Post to Community')}
        </Button>
      </div>
    </form>
  );

  if (isEdit) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border/50 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xl text-primary">Edit Post</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          {inner}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading text-xl text-primary">Share a Need or Offer</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
      </div>
      {inner}
    </motion.div>
  );
}

export default function CommunitySupport() {
  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [givingPost, setGivingPost] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('my_group'); // 'my_group' | 'all' | groupId
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        // Try to find member profile for group membership
        const profiles = await base44.entities.MemberProfile.filter({ email: me.email }, '-created_date', 1);
        if (profiles.length > 0) setMemberProfile(profiles[0]);
      }
    });
  }, []);

  const { data: groups = [] } = useQuery({
    queryKey: ['communityGroups'],
    queryFn: () => base44.entities.CommunityGroup.filter({ is_active: true }, 'sort_order', 50),
    enabled: !!user,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['communitySupport'],
    queryFn: () => base44.entities.CommunitySupport.filter({ status: 'open' }, '-created_date', 100),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CommunitySupport.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communitySupport'] });
      toast.success("Post deleted.");
    },
  });

  const handleDelete = (post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(post.id);
    }
  };

  const memberGroupId = memberProfile?.small_group_id || null;
  const memberGroupName = memberProfile?.small_group_name || null;

  // Resolve active group filter label
  const activeGroupId = groupFilter === 'my_group' ? memberGroupId : (groupFilter === 'all' ? null : groupFilter);

  const filtered = posts.filter(p => {
    const typeOk = typeFilter === 'all' || p.type === typeFilter;
    let groupOk = true;
    if (groupFilter === 'my_group') {
      groupOk = memberGroupId ? p.group_id === memberGroupId : true;
    } else if (groupFilter !== 'all') {
      groupOk = p.group_id === groupFilter;
    }
    return typeOk && groupOk;
  });

  const newPostDefaultGroupId = memberGroupId || '';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Give to Each Other</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              One Body, <span className="italic">Many Hands</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              This is a space for our community to meet one another's needs — from a ride to a doctor's appointment, to a warm meal, to a prayer.
            </p>
            <div className="bg-card border border-accent/20 rounded-2xl px-8 py-6 text-left max-w-2xl mx-auto">
              <p className="font-heading text-base text-primary leading-relaxed italic mb-3">
                "Suppose a brother or a sister is without clothes and daily food. If one of you says to them, 'Go in peace; keep warm and well fed,' but does nothing about their physical needs, what good is it? In the same way, faith by itself, if it is not accompanied by action, is dead."
              </p>
              <p className="font-body text-sm text-accent font-medium">— James 2:15–17</p>
            </div>
          </motion.div>
        </div>
      </section>

      {editingPost && (
        <PostForm
          post={editingPost}
          user={user}
          groups={groups}
          memberGroupId={memberGroupId}
          onClose={() => setEditingPost(null)}
          onSuccess={() => setEditingPost(null)}
          isEdit
        />
      )}

      {givingPost && (
        <GiveToMemberModal post={givingPost} user={user} onClose={() => setGivingPost(null)} />
      )}

      {/* Board */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-card rounded-2xl border border-border/50 px-8"
            >
              <Lock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="font-heading text-3xl text-primary mb-3">Members Only</h2>
              <p className="font-body text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Requests and offers are visible to signed-in members only, so our community can help one another in a safe, trusted space.
              </p>
              <Button className="font-body bg-primary hover:bg-primary/90 px-8" onClick={() => base44.auth.redirectToLogin()}>
                Sign In to Participate
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-3xl text-primary">Community Board</h2>
                  <p className="font-body text-sm text-muted-foreground mt-1">{filtered.length} open {filtered.length === 1 ? 'post' : 'posts'}</p>
                </div>
                <Button
                  size="sm"
                  className="font-body bg-primary hover:bg-primary/90 gap-1 shrink-0"
                  onClick={() => setShowForm(v => !v)}
                >
                  <Plus className="w-4 h-4" />
                  Post
                </Button>
              </div>

              {/* Group filter tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setGroupFilter('my_group')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-body font-medium transition-colors ${groupFilter === 'my_group' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
                >
                  {memberGroupName ? `My Group · ${memberGroupName}` : 'My Group'}
                </button>
                <button
                  onClick={() => setGroupFilter('all')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-body font-medium transition-colors ${groupFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
                >
                  All Groups
                </button>
                {groups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGroupFilter(g.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-body font-medium transition-colors ${groupFilter === g.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent'}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex bg-secondary/50 rounded-lg p-1 gap-1">
                  {[['all', 'All'], ['offer', 'Offering'], ['request', 'Seeking']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setTypeFilter(val)}
                      className={`px-3 py-1.5 rounded-md text-xs font-body font-medium transition-colors ${typeFilter === val ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {showForm && (
                <PostForm
                  user={user}
                  groups={groups}
                  memberGroupId={newPostDefaultGroupId}
                  onClose={() => setShowForm(false)}
                  onSuccess={() => setShowForm(false)}
                  isEdit={false}
                />
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                  <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="font-body text-muted-foreground">No posts yet. Be the first to offer or ask for help!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filtered.map(post => (
                    <PostCard key={post.id} post={post} user={user} onDelete={handleDelete} onEdit={setEditingPost} onGive={setGivingPost} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}