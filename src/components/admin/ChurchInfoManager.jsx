import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_FORM = {
  church_name: 'Hope Santa Barbara',
  tagline: 'A place and platform for life and relationships.',
  address: '123 Hope Street, Santa Barbara, CA 93101',
  maps_url: 'https://maps.google.com/?q=Hope+Church+Santa+Barbara+CA',
  maps_embed_url: '',
  phone: '(805) 555-HOPE',
  email: 'hello@hopesantabarbara.org',
  office_hours: 'Mon–Fri, 9:00 AM – 4:00 PM',
  sunday_times_display: 'Sundays 9:00 & 11:00 AM',
  service_times: [
    { day: 'Sunday', time: '9:00 AM', label: 'Morning Worship' },
    { day: 'Sunday', time: '11:00 AM', label: 'Main Service' },
    { day: 'Wednesday', time: '7:00 PM', label: 'Midweek Prayer' },
  ],
};

export default function ChurchInfoManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: results, isLoading } = useQuery({
    queryKey: ['churchInfo'],
    queryFn: () => base44.entities.ChurchInfo.filter({ key: 'main' }),
  });

  useEffect(() => {
    if (results?.[0]) {
      const r = results[0];
      setRecordId(r.id);
      setForm({
        church_name: r.church_name || DEFAULT_FORM.church_name,
        tagline: r.tagline || DEFAULT_FORM.tagline,
        address: r.address || DEFAULT_FORM.address,
        maps_url: r.maps_url || DEFAULT_FORM.maps_url,
        maps_embed_url: r.maps_embed_url || DEFAULT_FORM.maps_embed_url,
        phone: r.phone || DEFAULT_FORM.phone,
        email: r.email || DEFAULT_FORM.email,
        office_hours: r.office_hours || DEFAULT_FORM.office_hours,
        sunday_times_display: r.sunday_times_display || DEFAULT_FORM.sunday_times_display,
        service_times: r.service_times?.length ? r.service_times : DEFAULT_FORM.service_times,
      });
    }
  }, [results]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const updateServiceTime = (i, field, value) => {
    const updated = [...form.service_times];
    updated[i] = { ...updated[i], [field]: value };
    set('service_times', updated);
  };

  const addServiceTime = () => set('service_times', [...form.service_times, { day: '', time: '', label: '' }]);
  const removeServiceTime = (i) => set('service_times', form.service_times.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    const payload = { key: 'main', ...form };
    if (recordId) {
      await base44.entities.ChurchInfo.update(recordId, payload);
    } else {
      const created = await base44.entities.ChurchInfo.create(payload);
      setRecordId(created.id);
    }
    queryClient.invalidateQueries({ queryKey: ['churchInfo'] });
    toast.success('Church info saved!');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  if (isLoading) return <div className="py-8 text-center font-body text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="font-heading text-xl text-primary mb-6">Church Info & Contact Details</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Church Name</Label>
              <Input value={form.church_name} onChange={e => set('church_name', e.target.value)} className="font-body" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Tagline</Label>
              <Input value={form.tagline} onChange={e => set('tagline', e.target.value)} className="font-body" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Address</Label>
            <Input value={form.address} onChange={e => set('address', e.target.value)} className="font-body" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Phone</Label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)} className="font-body" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Email</Label>
              <Input value={form.email} onChange={e => set('email', e.target.value)} className="font-body" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Office Hours</Label>
            <Input value={form.office_hours} onChange={e => set('office_hours', e.target.value)} className="font-body" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Sunday Times (short display, e.g. "Sundays 9:00 & 11:00 AM")</Label>
            <Input value={form.sunday_times_display} onChange={e => set('sunday_times_display', e.target.value)} className="font-body" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Google Maps URL</Label>
            <Input value={form.maps_url} onChange={e => set('maps_url', e.target.value)} className="font-body" placeholder="https://maps.google.com/?q=..." />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Google Maps Embed URL</Label>
            <Input value={form.maps_embed_url} onChange={e => set('maps_embed_url', e.target.value)} className="font-body" placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="font-body text-xs text-muted-foreground">Get this from Google Maps → Share → Embed a map</p>
          </div>
        </div>
      </div>

      {/* Service Times */}
      <div>
        <h4 className="font-heading text-lg text-primary mb-4">Service Times</h4>
        <div className="space-y-3">
          {form.service_times.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input value={s.day} onChange={e => updateServiceTime(i, 'day', e.target.value)} placeholder="Day" className="font-body w-28" />
              <Input value={s.time} onChange={e => updateServiceTime(i, 'time', e.target.value)} placeholder="Time" className="font-body w-28" />
              <Input value={s.label} onChange={e => updateServiceTime(i, 'label', e.target.value)} placeholder="Label" className="font-body flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeServiceTime(i)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addServiceTime} className="font-body gap-2 mt-1">
            <Plus className="w-4 h-4" /> Add Time
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="font-body gap-2 bg-primary">
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
        {saved && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-body text-sm">
            <CheckCircle className="w-4 h-4" />
            Changes saved — live across the site!
          </div>
        )}
      </div>
    </div>
  );
}