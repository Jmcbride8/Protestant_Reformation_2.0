import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export default function AddNeedForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', date: '', start_time: '', end_time: '',
    slots_needed: '', category: 'other',
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.VolunteerNeed.create({
      ...form,
      slots_needed: parseInt(form.slots_needed),
      slots_filled: 0,
      status: 'open',
    });
    toast.success("Volunteer need created!");
    setForm({ title: '', description: '', date: '', start_time: '', end_time: '', slots_needed: '', category: 'other' });
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
      <h3 className="font-heading text-xl text-primary">Add Volunteer Need</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">Title *</Label>
          <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Sunday Setup Team" required className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Date *</Label>
          <Input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} required className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Spots Needed *</Label>
          <Input type="number" min="1" value={form.slots_needed} onChange={(e) => updateField('slots_needed', e.target.value)} required className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Start Time</Label>
          <Input value={form.start_time} onChange={(e) => updateField('start_time', e.target.value)} placeholder="9:00 AM" className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">End Time</Label>
          <Input value={form.end_time} onChange={(e) => updateField('end_time', e.target.value)} placeholder="12:00 PM" className="font-body" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">Category</Label>
          <Select value={form.category} onValueChange={(val) => updateField('category', val)}>
            <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['setup', 'greeting', 'kitchen', 'childcare', 'worship', 'cleanup', 'events', 'outreach', 'other'].map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="font-body text-sm">Description</Label>
          <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Details about the opportunity..." rows={3} className="font-body" />
        </div>
      </div>

      <Button type="submit" className="w-full font-body bg-primary hover:bg-primary/90">
        Create Volunteer Need
      </Button>
    </form>
  );
}