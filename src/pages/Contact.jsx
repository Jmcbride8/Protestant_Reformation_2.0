import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { CheckCircle, MapPin, Phone, Mail, Clock, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import BecomeMemberModal from '@/components/membership/BecomeMemberModal';
import { useChurchInfo } from '@/hooks/useChurchInfo';

const serviceTypes = [
  { value: 'marriage_counseling', label: 'Marriage Counseling' },
  { value: 'parenting_support', label: 'Parenting Support' },
  { value: 'career_guidance', label: 'Career & Life Guidance' },
  { value: 'wedding_inquiry', label: 'Wedding Inquiry' },
  { value: 'grief_support', label: 'Grief & Loss Support' },
  { value: 'general_prayer', label: 'Prayer Request' },
  { value: 'membership', label: 'Membership Interest' },
  { value: 'other', label: 'General Question' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const info = useChurchInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.ContactRequest.create(form);
    setSubmitted(true);
    toast.success("Your message has been sent!");
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="pt-20">
      {showMemberModal && <BecomeMemberModal onClose={() => setShowMemberModal(false)} />}

      {/* We'd Love to Hear From You */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Reach Out</p>
            <h2 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              We'd Love to <span className="italic">Hear From You</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Whether you need support, have a question, or just want to say hello — 
              we're here.
            </p>
            <Button
              size="lg"
              onClick={() => setShowMemberModal(true)}
              className="font-body bg-primary hover:bg-primary/90 gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Become a Member
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-heading text-2xl text-primary mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-primary">Visit Us</p>
                      <p className="font-body text-sm text-muted-foreground">{info.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-primary">Call Us</p>
                      <p className="font-body text-sm text-muted-foreground">{info.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-primary">Email Us</p>
                      <p className="font-body text-sm text-muted-foreground">{info.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-primary">Office Hours</p>
                      <p className="font-body text-sm text-muted-foreground">{info.office_hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-card rounded-2xl border border-border/50"
                >
                  <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="font-heading text-2xl text-primary mb-2">Message Sent!</h3>
                  <p className="font-body text-muted-foreground max-w-md mx-auto">
                    We've received your message and will get back to you within 24-48 hours. 
                    If urgent, please call us directly.
                  </p>
                  <Button className="mt-6 font-body" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service_type: '', message: '' }); }}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-8 space-y-6">
                  <h3 className="font-heading text-2xl text-primary mb-2">How Can We Help?</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Full Name *</Label>
                      <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your name" required className="font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Email *</Label>
                      <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" required className="font-body" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Phone</Label>
                      <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(805) 555-1234" className="font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">I'm Reaching Out About *</Label>
                      <Select value={form.service_type} onValueChange={(val) => updateField('service_type', val)} required>
                        <SelectTrigger className="font-body"><SelectValue placeholder="Select a topic" /></SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-sm">Your Message *</Label>
                    <Textarea 
                      value={form.message} 
                      onChange={(e) => updateField('message', e.target.value)} 
                      placeholder="Tell us what's on your heart. We're here to listen."
                      rows={5}
                      required 
                      className="font-body"
                    />
                  </div>

                  <Button type="submit" className="w-full font-body tracking-wide bg-primary hover:bg-primary/90" size="lg">
                    Send Message
                  </Button>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    All messages are confidential and handled with care.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}