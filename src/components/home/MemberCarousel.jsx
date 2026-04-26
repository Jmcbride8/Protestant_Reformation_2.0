import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditableImage from '@/components/admin/EditableImage';

const members = [
  {
    name: "The Rivera Family",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=800&fit=crop&crop=center",
    profession: "Carlos, Maria & their four kids",
    shortQuote: "We were searching for a church that would grow our whole family in the faith — we found it here.",
    testimony: "We visited on a random Sunday in 2016, mostly because it was close to home. We didn't expect much. But the kids loved it, and the sermon hit us both hard. We were in a small group within the month. Now our oldest leads the youth worship team and our youngest can recite more Scripture than either of us. Hope Church is woven into the fabric of our family.",
    whyHope: "They never treated our kids as an afterthought. They were discipled, loved, and taken seriously from day one."
  },
  {
    name: "The Andersons",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&crop=top",
    profession: "Newlyweds, married here in 2022",
    shortQuote: "We got married at Hope. Now we're building our life here.",
    testimony: "We met through a mutual friend at a young adults' group here. Neither of us was looking for anything serious — in faith or in love. But the community kept drawing us deeper into both. When the time came, there was nowhere else we'd have wanted to exchange our vows. Pastor prayed over us, the whole church celebrated with us. It felt like family.",
    whyHope: "This place taught us what covenant means — before we made one to each other."
  },
  {
    name: "The Kimura Family",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&crop=center",
    profession: "Kenji, Aiko & two toddlers",
    shortQuote: "As a Japanese-American family, we weren't sure we'd feel at home. We do.",
    testimony: "We moved to Santa Barbara from the Bay Area when Kenji's job relocated. We were nervous starting over. We visited half a dozen churches before someone told us about Hope. What struck us first was how genuinely diverse the congregation was — not performatively, but organically. Our daughters are growing up knowing the Gospel and knowing they belong.",
    whyHope: "The Word is preached faithfully and the table is open wide. That's all we ever wanted."
  },
  {
    name: "Bob & Linda Hartman",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop&crop=top",
    profession: "Retired teachers, grandparents of six",
    shortQuote: "We've been part of this church for over a decade. It keeps getting richer.",
    testimony: "We joined Hope in 2013 after decades at another congregation that had slowly drifted from Scripture. What we found here was a return to the basics — expository preaching, genuine community, a passion for the lost. We've watched young families come in, grow, and now serve alongside us. That kind of multigenerational life is rare and beautiful.",
    whyHope: "At our age, you know what's real. This is real."
  },
  {
    name: "The Osei-Bonsu Family",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop&crop=faces",
    profession: "Emmanuel, Grace & their three children",
    shortQuote: "We came from Ghana with nothing but our faith. This church helped us build a new home.",
    testimony: "When we arrived in Santa Barbara, we were overwhelmed. We found Hope through a flyer at the community center. From the first week, people showed up — helping us find an apartment, connecting us with work, welcoming our kids into Sunday school. It wasn't charity; it felt like family. We have never forgotten that, and we try to do the same for every new face we see.",
    whyHope: "They did not just preach hospitality — they practiced it. That is the Gospel with skin on."
  },
];

export default function MemberCarousel({ isAdmin }) {
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
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Real People Keeping it Real</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Who You'll Meet</h2>
          {/* Identity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mt-10 mb-14">
            <div className="bg-white border border-border/50 rounded-xl p-5 text-left shadow-sm">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">What We Are</p>
              <p className="font-body text-sm text-foreground leading-relaxed">A place and platform for life and relationships — with God, and with each other.</p>
            </div>
            <div className="bg-white border border-border/50 rounded-xl p-5 text-left shadow-sm">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">What We Are Not</p>
              <p className="font-body text-sm text-foreground leading-relaxed">A one-person show or a lecture hall. We're here together, not just in rows.</p>
            </div>
            <div className="bg-primary rounded-xl p-5 text-left shadow-sm">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Our Belief</p>
              <p className="font-body text-sm text-primary-foreground leading-relaxed italic">"It's the people, not the place, that are the church."</p>
            </div>
          </div>

          {/* Segue into member cards */}
          <div className="text-center mb-2">
            <p className="font-body text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              These are a few of the people you'll run into on a Sunday morning — neighbours, newcomers, and longtime friends. Click on a card to get to know them more.
            </p>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={() => go(-1)}
            className="z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Mobile: single full-width card */}
          <div className="sm:hidden w-full max-w-sm mx-auto">
            <motion.div
              key={members[current].name}
              onClick={() => setSelected(members[current])}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden text-left shadow-2xl cursor-pointer relative w-full"
              style={{ aspectRatio: '3/4' }}
            >
              <EditableImage
                imageKey={`member_${members[current].name.toLowerCase().replace(/\s+/g, '_')}`}
                src={members[current].image}
                alt={members[current].name}
                className="absolute inset-0 w-full h-full object-cover"
                isAdmin={isAdmin}
                wrapperClassName="absolute inset-0 group/editimg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h4 className="font-heading text-2xl text-white leading-tight">{members[current].name}</h4>
                <p className="font-body text-sm text-white/70 mb-3">{members[current].profession}</p>
                <Quote className="w-5 h-5 text-accent/80 mb-1" />
                <p className="font-body text-base text-white/90 leading-relaxed italic line-clamp-3">
                  {members[current].shortQuote}
                </p>
                <p className="font-body text-sm text-accent mt-3 font-medium">Tap to read their story →</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop: three-card carousel */}
          <div className="hidden sm:flex gap-5 overflow-hidden w-full max-w-4xl">
            {visible.map((member, i) => (
              <motion.div
                key={member.name}
                onClick={() => i === 1 && setSelected(member)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: i === 1 ? 1 : 0.4,
                  scale: i === 1 ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
                className={`flex-1 min-w-0 rounded-2xl overflow-hidden text-left transition-all duration-300 relative ${
                  i === 1
                    ? 'shadow-2xl cursor-pointer hover:shadow-2xl'
                    : 'cursor-default pointer-events-none'
                }`}
                style={{ aspectRatio: '3/4' }}
              >
                <EditableImage
                  imageKey={`member_${member.name.toLowerCase().replace(/\s+/g, '_')}`}
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  isAdmin={isAdmin && i === 1}
                  wrapperClassName="absolute inset-0 group/editimg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="font-heading text-2xl text-white leading-tight">{member.name}</h4>
                  <p className="font-body text-sm text-white/70 mb-3">{member.profession}</p>
                  <Quote className="w-5 h-5 text-accent/80 mb-1" />
                  <p className="font-body text-base text-white/90 leading-relaxed italic line-clamp-2">
                    {member.shortQuote}
                  </p>
                  {i === 1 && (
                    <p className="font-body text-sm text-accent mt-3 font-medium">Click to read their story →</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
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

        {/* CTA below carousel */}
        <div className="text-center mt-10">
          <Link to="/contact">
            <Button className="font-body bg-primary hover:bg-primary/90 gap-2">
              <UserPlus className="w-4 h-4" />
              Become a Member
            </Button>
          </Link>
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