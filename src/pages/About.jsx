import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, MapPin, Phone, Mail, Clock, UserPlus, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { BookOpen, Cross, Heart, Globe, Users, Zap, Star, Flame, Shield } from 'lucide-react';
import { toast } from "sonner";
import BecomeMemberModal from '@/components/membership/BecomeMemberModal';
import { useChurchInfo } from '@/hooks/useChurchInfo';

const ICON_MAP = { BookOpen, Cross, Heart, Globe, Users, Zap, Star, Flame, Shield };

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

// ─── Section: Divider ────────────────────────────────────────────────────────
function SectionLabel({ label }) {
  return (
    <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">{label}</p>
  );
}

// ─── Section 1: Leadership ───────────────────────────────────────────────────
function TeamMemberCard({ member }) {
  return (
    <div className="relative w-52 h-64 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
      {member.photo_url
        ? <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
        : <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <span className="font-heading text-6xl text-white/40">{member.full_name?.[0]}</span>
          </div>
      }
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="font-heading text-lg text-white leading-tight">{member.full_name}</h4>
        <p className="font-body text-xs text-white/70 mt-0.5 tracking-wide">{member.role}</p>
      </div>
    </div>
  );
}

function TeamCarousel({ members }) {
  const [index, setIndex] = useState(0);
  if (members.length === 0) return null;
  const prev = () => setIndex(i => (i - 1 + members.length) % members.length);
  const next = () => setIndex(i => (i + 1) % members.length);
  const visibleCount = Math.min(members.length, 3);
  const visible = Array.from({ length: visibleCount }, (_, i) => members[(index + i) % members.length]);

  return (
    <div>
      <div className="hidden sm:flex items-center justify-center gap-4">
        {members.length > visibleCount && (
          <button onClick={prev} className="w-10 h-10 rounded-full bg-border hover:bg-border/80 flex items-center justify-center transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        )}
        <div className="flex gap-8 justify-center">
          {visible.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <TeamMemberCard member={m} />
            </motion.div>
          ))}
        </div>
        {members.length > visibleCount && (
          <button onClick={next} className="w-10 h-10 rounded-full bg-border hover:bg-border/80 flex items-center justify-center transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>
      <div className="sm:hidden flex items-center justify-center gap-4">
        {members.length > 1 && (
          <button onClick={prev} className="w-10 h-10 rounded-full bg-border hover:bg-border/80 flex items-center justify-center transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        )}
        <motion.div key={members[index].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <TeamMemberCard member={members[index]} />
        </motion.div>
        {members.length > 1 && (
          <button onClick={next} className="w-10 h-10 rounded-full bg-border hover:bg-border/80 flex items-center justify-center transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>
      {members.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {members.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadershipSection({ members }) {
  return (
    <section className="py-28 bg-secondary/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-4">Leadership</p>
          <h2 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
            Meet the <span className="italic">Team</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Real people with open doors. We'd love to get to know you.
          </p>
        </motion.div>
        {members.length > 0 && <TeamCarousel members={members} />}
      </div>
    </section>
  );
}

// ─── Section 2: Vision ───────────────────────────────────────────────────────
function VisionSection() {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel label="Vision" />
          <h2 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
            Relationships First. <span className="italic">Always.</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A vision for a church that moves beyond broadcasting information to cultivating genuine, lasting human connection — at any scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { heading: 'Know & Be Known', body: 'We believe every person deserves to be truly seen. Not as a face in a crowd, but as someone with a name, a story, and a place at the table.' },
            { heading: 'Rooted in Scripture', body: 'Everything we do flows from our love for the Word. We study it, preach it, and try to live it — humbly and honestly, week after week.' },
            { heading: 'Open to All', body: "Whether you've followed Jesus for decades or you're curious for the first time — you're welcome here exactly as you are." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-secondary/40 rounded-2xl p-8 border border-border/40"
            >
              <div className="w-2 h-2 rounded-full bg-accent mb-6" />
              <h3 className="font-heading text-xl text-primary mb-3">{item.heading}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/vision">
            <Button variant="outline" className="font-body gap-2">
              Read the Full Vision <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 3: Beliefs ──────────────────────────────────────────────────────
function BeliefAccordion({ belief, isOpen, onToggle, index }) {
  const Icon = ICON_MAP[belief.icon] || BookOpen;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-card'}`}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-6 text-left">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-accent/15' : 'bg-secondary'}`}>
          <Icon className={`w-5 h-5 transition-colors ${isOpen ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-heading text-lg text-primary">{belief.title}</h4>
          <p className="font-body text-sm text-muted-foreground mt-0.5">{belief.summary}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
            <div className="px-6 pb-6 pt-0 pl-20">
              <p className="font-body text-muted-foreground leading-relaxed text-sm">{belief.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BeliefsSection({ beliefs }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="py-28 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel label="What We Believe" />
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Core Beliefs</h2>
          <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We hold to the historic Christian faith. These convictions aren't walls to keep people out — they're anchors that hold us steady and unite us in truth and love.
          </p>
        </motion.div>
        <div className="space-y-3">
          {beliefs.map((belief, index) => (
            <BeliefAccordion key={belief.id} belief={belief} index={index} isOpen={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Story ────────────────────────────────────────────────────────
function StorySection() {
  const milestones = [
    { year: '1985', title: 'Founded', body: 'Hope Church was planted by a small group of families in Santa Barbara who believed that the city needed a place of authentic, Spirit-led worship.' },
    { year: '1997', title: 'Community Meals Begin', body: 'We launched our Wednesday community meals — $5 per person — rooted in the conviction that Jesus always made room at the table.' },
    { year: '2006', title: 'Hope 4 Kids', body: 'We opened our first early learning center, providing affordable childcare to families in Santa Barbara regardless of circumstance.' },
    { year: '2014', title: 'Expanded Sanctuary', body: 'After years of growth, we completed a sanctuary renovation — making room for more people while preserving the intimacy of our community.' },
    { year: 'Today', title: 'Still Growing', body: 'We continue to grow — not just in numbers, but in depth. Our heart is the same as it was at the beginning: know people and be known.' },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <SectionLabel label="Our Story" />
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            Four Decades of <span className="italic">Faithful Presence</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We didn't start big. We started with people who cared — and that hasn't changed.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border/60 hidden sm:block" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="sm:flex gap-10 items-start"
              >
                <div className="hidden sm:flex flex-col items-center w-16 shrink-0">
                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-background shadow mt-1.5" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-1">{m.year}</p>
                  <h3 className="font-heading text-2xl text-primary mb-2">{m.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{m.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Membership ───────────────────────────────────────────────────
function MembershipSection({ onOpenModal }) {
  const steps = [
    { num: '01', title: 'Attend a Service', body: 'Come as you are. You don\'t need to believe anything specific yet — just show up.' },
    { num: '02', title: 'Follow Jesus', body: 'Faith isn\'t a prerequisite — it\'s an invitation. We walk with you wherever you are on that journey.' },
    { num: '03', title: 'Apply for Membership', body: 'When you\'re ready, fill out a short application. We review every one personally.' },
    { num: '04', title: 'Be More Than a Number', body: 'You\'re not joining a crowd — you\'re becoming family. People who know your name, show up for you, and do life together.' },
  ];

  return (
    <section className="py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 70% 80%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-white/50 mb-4">Membership</p>
          <h2 className="font-heading text-4xl sm:text-6xl text-white mb-6">
            This is Your <span className="italic text-accent">Home Too</span>
          </h2>
          <p className="font-body text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Membership isn't about joining a club. It's a commitment to a community — to show up, to give, to grow, and to love one another well.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <p className="font-heading text-4xl text-accent/40 mb-4">{step.num}</p>
              <h3 className="font-heading text-xl text-white mb-2">{step.title}</h3>
              <p className="font-body text-white/60 text-sm leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={onOpenModal}
            className="font-body bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Apply for Membership
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Contact ──────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const info = useChurchInfo();
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.ContactRequest.create(form);
    setSubmitted(true);
    toast.success("Your message has been sent!");
  };

  return (
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel label="Reach Out" />
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            We'd Love to <span className="italic">Hear From You</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you need support, have a question, or just want to say hello — we're here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: 'Visit Us', value: info.address },
              { icon: Phone, label: 'Call Us', value: info.phone },
              { icon: Mail, label: 'Email Us', value: info.email },
              { icon: Clock, label: 'Office Hours', value: info.office_hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-medium text-primary">{label}</p>
                  <p className="font-body text-sm text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-card rounded-2xl border border-border/50">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-primary mb-2">Message Sent!</h3>
                <p className="font-body text-muted-foreground max-w-md mx-auto">
                  We've received your message and will get back to you within 24–48 hours.
                </p>
                <Button className="mt-6 font-body" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service_type: '', message: '' }); }}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-8 space-y-6">
                <h3 className="font-heading text-2xl text-primary">How Can We Help?</h3>
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
                  <Textarea value={form.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Tell us what's on your heart. We're here to listen." rows={5} required className="font-body" />
                </div>
                <Button type="submit" className="w-full font-body tracking-wide bg-primary hover:bg-primary/90" size="lg">Send Message</Button>
                <p className="font-body text-xs text-muted-foreground text-center">All messages are confidential and handled with care.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative pt-40 pb-28 px-4 overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(38 45% 60%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(38 45% 60%) 0%, transparent 40%)' }} />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-4">
          Hope Church Santa Barbara
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading text-5xl md:text-7xl text-white mb-6 leading-tight">
          Who We Are
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-body text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          A church in Santa Barbara built on the conviction that every person deserves to know and be known. This is our story, our team, and our heart.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function About() {
  const [showMemberModal, setShowMemberModal] = useState(false);

  const { data: allMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.MemberProfile.filter({ is_directory_visible: true }),
  });
  const members = allMembers.filter(m => m.role === 'Pastor' || m.role === 'Staff');

  const { data: beliefs = [] } = useQuery({
    queryKey: ['beliefs'],
    queryFn: () => base44.entities.Belief.list('sort_order', 50),
  });

  return (
    <div className="min-h-screen bg-background">
      {showMemberModal && <BecomeMemberModal onClose={() => setShowMemberModal(false)} />}
      <AboutHero />
      <LeadershipSection members={members} />
      <VisionSection />
      <BeliefsSection beliefs={beliefs} />
      <StorySection />
      <MembershipSection onOpenModal={() => setShowMemberModal(true)} />
      <ContactSection />
    </div>
  );
}