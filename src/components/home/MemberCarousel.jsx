import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const members = [
  {
    name: "Sarah & Tom Mitchell",
    role: "Members since 2018",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=face",
    shortQuote: "Hope Church gave us a family when we were far from home.",
    profession: "Nurse & High School Teacher",
    testimony: "We moved to Santa Barbara in 2017 knowing no one. We'd walked away from church years before — life had gotten complicated. A neighbor invited us to a Wednesday dinner just to get out of the house. We came for the food, but stayed because of the people. Within months, we were in a small group, then leading one. Our faith came alive again in a way we didn't think was possible.",
    whyHope: "No one asked us to have it together before they welcomed us. That's rare. And that's Jesus."
  },
  {
    name: "Marcus Johnson",
    role: "Member since 2021",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    shortQuote: "I came as a skeptic. The Gospel found me here.",
    profession: "Software Engineer, UCSB Alum",
    testimony: "I graduated UCSB as a convinced atheist. A coworker dragged me to a Sunday service on a dare. I sat in the back, arms crossed. But the pastor preached from Romans — no fluff, no performance — and something cracked open. I started asking questions nobody got defensive about. A year of honest conversation later, I was baptized in the Pacific.",
    whyHope: "They let me doubt out loud. And they pointed me to Scripture every single time."
  },
  {
    name: "Elena Vasquez",
    role: "Member since 2019",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
    shortQuote: "After my divorce, I didn't think I belonged anywhere. Hope Church disagreed.",
    profession: "Graphic Designer & Mom of Two",
    testimony: "My marriage fell apart in 2018. I was embarrassed, broken, and convinced the church had no room for someone like me. A friend from work — who I didn't even know was a Christian — quietly told me about Hope. I came expecting judgment. Instead, the grief support group became my lifeline. Real women, real Scripture, real healing. I've never looked back.",
    whyHope: "They preach the whole Bible — including the parts about God restoring what's broken. I needed that."
  },
  {
    name: "James & Ruth Okafor",
    role: "Members since 2015",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop&crop=face",
    shortQuote: "We've raised our three kids here. This church shaped who they're becoming.",
    profession: "Accountant & Stay-at-Home Mom",
    testimony: "We were looking for a church that took children seriously — not just a drop-off nursery, but a place that actually discipled kids. Hope's children's ministry does that. Our kids know their Bibles, they know their church family, and they know they're loved by God. Watching our son lead worship at 14 is something we couldn't have imagined elsewhere.",
    whyHope: "The preaching is faithful and the community is real. That combination is harder to find than you'd think."
  },
  {
    name: "David Nguyen",
    role: "Member since 2023",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    shortQuote: "I was homeless for two years. This church saw me as a person.",
    profession: "Barista & Volunteer Outreach Lead",
    testimony: "I spent two winters on the streets of Santa Barbara. The outreach team showed up every Thursday — hot food, no lecture. They remembered my name. Eventually one of the volunteers helped me connect with housing services. I got stable, got a job, and started attending. I've been a member for a year now and I lead the same Thursday outreach that found me.",
    whyHope: "They lived out Matthew 25 before I ever knew the verse. That's the real thing."
  },
];

export default function MemberCarousel() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(1);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + members.length) % members.length);
  };

  const visible = [
    members[(current - 1 + members.length) % members.length],
    members[current],
    members[(current + 1) % members.length],
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Our Community</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Meet a Few of Our Members</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every story here is a testament to God's faithfulness. Click any card to hear more.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            className="z-10 w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          <div className="flex gap-4 overflow-hidden w-full max-w-3xl">
            {visible.map((member, i) => (
              <motion.button
                key={member.name}
                onClick={() => i === 1 && setSelected(member)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: i === 1 ? 1 : 0.45,
                  scale: i === 1 ? 1 : 0.92,
                }}
                transition={{ duration: 0.3 }}
                className={`flex-1 min-w-0 rounded-2xl overflow-hidden text-left transition-all duration-300 relative ${
                  i === 1
                    ? 'shadow-xl cursor-pointer hover:shadow-2xl'
                    : 'cursor-default pointer-events-none'
                }`}
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="font-heading text-xl text-white leading-tight">{member.name}</h4>
                  <p className="font-body text-xs text-white/70 mb-2">{member.profession}</p>
                  <Quote className="w-4 h-4 text-accent/80 mb-1" />
                  <p className="font-body text-sm text-white/90 leading-relaxed italic line-clamp-2">
                    {member.shortQuote}
                  </p>
                  {i === 1 && (
                    <p className="font-body text-xs text-accent mt-2 font-medium">Click to read their story →</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="z-10 w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-accent w-5' : 'bg-border'}`}
            />
          ))}
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent/30"
                />
                <div>
                  <h3 className="font-heading text-2xl text-primary">{selected.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{selected.profession}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Their Testimony</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{selected.testimony}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Why Hope Church?</p>
                  <p className="font-body text-sm text-foreground leading-relaxed italic">"{selected.whyHope}"</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}