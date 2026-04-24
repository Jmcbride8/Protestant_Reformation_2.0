import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Pencil, Plus, X, Users, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EMPTY_FORM = {
  title: '', description: '', date: '', start_time: '', end_time: '',
  location: '', category: 'community', is_rsvp_enabled: false, rsvp_limit: '', is_active: true,
};

const categoryColors = {
  worship: 'bg-primary/10 text-primary', community: 'bg-accent/20 text-accent',
  prayer: 'bg-purple-100 text-purple-700', youth: 'bg-emerald-100 text-emerald-700',
  outreach: 'bg-blue-100 text-blue-700', other: 'bg-muted text-muted-foreground',
};

export default function EventsManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewRsvps, setViewRsvps] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ['adminCalendarEvents'],
    queryFn: () => base44.entities.CalendarEvent.list('date', 200),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ['adminCalendarRsvps'],
    queryFn: () => base44.entities.CalendarEventRSVP.list('-created_date', 500),
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      location: event.location || '',
      category: event.category || 'community',
      is_rsvp_enabled: event.is_rsvp_enabled || false,
      rsvp_limit: event.rsvp_limit || '',
      is_active: event.is_active !== false,
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form, rsvp_limit: form.rsvp_limit ? Number(form.rsvp_limit) : undefined };
    if (editing) {
      await base44.entities.CalendarEvent.update(editing.id, data);
      toast.success('Event updated');
    } else {
      await base44.entities.CalendarEvent.create(data);
      toast.success('Event created');
    }
    qc.invalidateQueries({ queryKey: ['adminCalendarEvents'] });
    qc.invalidateQueries({ queryKey: ['calendarEvents'] });
    setShowForm(false);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.CalendarEvent.delete(id);
    qc.invalidateQueries({ queryKey: ['adminCalendarEvents'] });
    qc.invalidateQueries({ queryKey: ['calendarEvents'] });
    toast.success('Event deleted');
  };

  const getRsvpsForEvent = (eventId) => rsvps.filter(r => r.event_id === eventId);
  const getRsvpCount = (eventId) => getRsvpsForEvent(eventId).reduce((sum, r) => sum + (r.guest_count || 1), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-primary">Calendar Events</h3>
        <Button onClick={openNew} className="font-body gap-2 bg-primary">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading text-lg text-primary">{editing ? 'Edit Event' : 'New Event'}</h4>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="font-body text-sm text-muted-foreground block mb-1">Title *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm text-muted-foreground block mb-1">Description</label>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="font-body" />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">Date *</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className="font-body" />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['worship', 'community', 'prayer', 'youth', 'outreach', 'other'].map(c => (
                      <SelectItem key={c} value={c} className="font-body capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">Start Time</label>
                <Input value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="font-body" placeholder="9:00 AM" />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">End Time</label>
                <Input value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="font-body" placeholder="11:00 AM" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm text-muted-foreground block mb-1">Location</label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="font-body" placeholder="Main Sanctuary" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_rsvp_enabled} onCheckedChange={v => setForm(f => ({ ...f, is_rsvp_enabled: v }))} />
                <label className="font-body text-sm text-foreground">Enable RSVP</label>
              </div>
              {form.is_rsvp_enabled && (
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-1">RSVP Limit (optional)</label>
                  <Input type="number" min={1} value={form.rsvp_limit} onChange={e => setForm(f => ({ ...f, rsvp_limit: e.target.value }))} className="font-body w-32" placeholder="No limit" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <label className="font-body text-sm text-foreground">Visible on calendar</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="font-body">Cancel</Button>
              <Button type="submit" disabled={loading} className="font-body bg-primary">{loading ? 'Saving…' : 'Save Event'}</Button>
            </div>
          </form>
        </div>
      )}

      {/* RSVP Detail View */}
      {viewRsvps && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading text-lg text-primary">RSVPs — {viewRsvps.title}</h4>
            <button onClick={() => setViewRsvps(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-2">
            {getRsvpsForEvent(viewRsvps.id).map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{r.member_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{r.member_email}</p>
                  {r.notes && <p className="font-body text-xs text-muted-foreground italic">{r.notes}</p>}
                </div>
                <span className="font-body text-sm text-primary font-medium">{r.guest_count || 1} attending</span>
              </div>
            ))}
            {getRsvpsForEvent(viewRsvps.id).length === 0 && (
              <p className="font-body text-muted-foreground text-center py-4">No RSVPs yet.</p>
            )}
            <div className="pt-2 border-t border-border font-body text-sm text-primary font-medium">
              Total: {getRsvpCount(viewRsvps.id)} people
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.sort((a, b) => a.date.localeCompare(b.date)).map(event => (
          <div key={event.id} className={`flex items-center justify-between p-4 bg-card rounded-lg border ${event.is_active === false ? 'opacity-50 border-border/30' : 'border-border/50'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-heading text-base text-primary">{event.title}</h4>
                <Badge className={`font-body text-xs capitalize ${categoryColors[event.category]}`}>{event.category}</Badge>
                {event.is_rsvp_enabled && <Badge className="font-body text-xs bg-accent/20 text-accent"><CalendarCheck className="w-3 h-3 mr-1 inline" />RSVP</Badge>}
                {event.is_active === false && <Badge variant="outline" className="font-body text-xs">Hidden</Badge>}
              </div>
              <p className="font-body text-xs text-muted-foreground">
                {format(new Date(event.date + 'T00:00:00'), 'EEE, MMM d, yyyy')}
                {event.start_time ? ` • ${event.start_time}` : ''}
                {event.location ? ` • ${event.location}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-3">
              {event.is_rsvp_enabled && (
                <Button variant="ghost" size="sm" onClick={() => setViewRsvps(event)}
                  className="font-body text-xs gap-1 text-muted-foreground hover:text-primary">
                  <Users className="w-3.5 h-3.5" />
                  {getRsvpCount(event.id)}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => openEdit(event)}>
                <Pencil className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="font-body text-muted-foreground text-center py-8">No events yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}