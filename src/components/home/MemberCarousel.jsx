import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditableImage from '@/components/admin/EditableImage';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const FALLBACK_MEMBERS = [
  {
    id: 'fallback-1',
    name: "The Rivera Family",
    image_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=800&fit=crop&crop=center",
    profession: "Carlos, Maria & their four kids",
    short_quote: "We were searching for a church that would grow our whole family in the faith — we found it here.",
    testimony: "We visited on a random Sunday in 2016, mostly because it was close to home. We didn't expect much. But the kids loved it, and the sermon hit us both hard. We were in a small group within the month. Now our oldest leads the youth worship team and our youngest can recite more Scripture than either of us. Hope Church is woven into the fabric of our family.",
    why_hope: "They never treated our kids as an afterthought. They were discipled, loved, and taken seriously from day one."
  },
  {
    id: 'fallback-2',
    name: "The Andersons",
    image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&crop=top",
    profession: "Newlyweds, married here in 2022",
    short_quote: "We got married at Hope. Now we're building our life here.",
    testimony: "We met through a mutual friend at a young adults' group here. Neither of us was looking for anything serious — in faith or in love. But the community kept drawing us deeper into both. When the time came, there was nowhere else we'd have wanted to exchange our vows. Pastor prayed over us, the whole church celebrated with us. It felt like family.",
    why_hope: "This place taught us what covenant means — before we made one to each other."
  },
  {
    id: 'fallback-3',
    name: "The Kimura Family",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&crop=center",
    profession: "Kenji, Aiko & two toddlers",
    short_quote: "As a Japanese-American family, we weren't sure we'd feel at home. We do.",
    testimony: "We moved to Santa Barbara from the Bay Area when Kenji's job relocated. We were nervous starting over. We visited half a dozen churches before someone told us about Hope. What struck us first was how genuinely diverse the congregation was — not performatively, but organically. Our daughters are growing up knowing the Gospel and knowing they belong.",
    why_hope: "The Word is preached faithfully and the table is open wide. That's all we ever wanted."
  },
  {
    id: 'fallback-4',
    name: "Bob & Linda Hartman",
    image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop&crop=top",
    profession: "Retired teachers, grandparents of six",
    short_quote: "We've been part of this church for over a decade. It keeps getting richer.",
    testimony: "We joined Hope in 2013 after decades at another congregation that had slowly drifted from Scripture. What we found here was a return to the basics — expository preaching, genuine community, a passion for the lost. We've watched young families come in, grow, and now serve alongside us. That kind of multigenerational life is rare and beautiful.",
    why_hope: "At our age, you know what's real. This is real."
  },
  {
    id: 'fallback-5',
    name: "The Osei-Bonsu Family",
    image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop&crop=faces",
    profession: "Emmanuel, Grace & their three children",
    short_quote: "We came from Ghana with nothing but our faith. This church helped us build a new home.",
    testimony: "When we arrived in Santa Barbara, we were overwhelmed. We found Hope through a flyer at the community center. From the first week, people showed up — helping us find an apartment, connecting us with work, welcoming our kids into Sunday school. It wasn't charity; it felt like family. We have never forgotten that, and we try to do the same for every new face we see.",
    why_hope: "They did not just preach hospitality — they practiced it. That is the Gospel with skin on."
  },
];

// Card configs: [farLeft, left, center, right, farRight]
// x is in px offset from center
const CARD_CONFIGS = [
  { x: -420, rotate: -16, scale: 0.68, opacity: 0.40, zIndex: 1 },
  { x: -210, rotate: -8,  scale: 0.82, opacity: 0.62, zIndex: 2 },
  { x: 0,    rotate: 0,   scale: 1,    opacity: 1,    zIndex: 5 },
  { x: 210,  rotate: 8,   scale: 0.82, opacity: 0.62, zIndex: 2 },
  { x: 420,  rotate: 16,  scale: 0.68, opacity: 0.40, zIndex: 1 },
];

export default function MemberCarousel({ isAdmin }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(1);

  const { data: dbMembers = [] } = useQuery({
    queryKey: ['carouselMembers'],
    queryFn: () => base44.entities.CarouselMember.list('sort_order', 50),
  });

  const members = dbMembers.filter(m => m.is_active).length > 0
    ? dbMembers.filter(m => m.is_active)
    : FALLBACK_MEMBERS;

  const go = (dir) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + members.length) % members.length);
  };

  // Get 5 visible members centered around current
  const getVisible = () => {
    return [-2, -1, 0, 1, 2].map(offset => ({
      member: members[(current + offset + members.length) % members.length],
      offset,
    }));
  };

  return (
    <section className="py-24" style={{ background: '#F5F0E8' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl sm:text-6xl text-primary">Who You'll Meet</h2>
        </motion.div>

        {/* Fan carousel */}
        <div className="relative flex items-center justify-center" style={{ height: 560 }}>

          {/* Left arrow */}
          <button
            onClick={() => go(-1)}
            className="absolute left-2 z-20 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Cards */}
          <div className="relative w-full flex items-center justify-center" style={{ height: 540 }}>
            {getVisible().map(({ member, offset }, i) => {
              const cfg = CARD_CONFIGS[i];
              const isCenter = offset === 0;
              return (
                <motion.div
                  key={member.id || member.name}
                  animate={{
                    x: cfg.x,
                    rotate: cfg.rotate,
                    scale: cfg.scale,
                    opacity: cfg.opacity,
                    zIndex: cfg.zIndex,
                  }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={() => isCenter && setSelected(member)}
                  className="absolute"
                  style={{
                    width: 300,
                    transformOrigin: 'bottom center',
                    cursor: isCenter ? 'pointer' : 'default',
                  }}
                >
                  {/* Rainbow border wrapper for center card */}
                  <div
                    style={{
                      padding: isCenter ? 2.5 : 0,
                      borderRadius: 28,
                      background: isCenter
                        ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 35%, #c3b1e1 65%, #a8edea 100%)'
                        : 'transparent',
                      boxShadow: isCenter
                        ? '0 24px 64px rgba(0,0,0,0.16)'
                        : '0 8px 24px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="bg-white overflow-hidden" style={{ borderRadius: isCenter ? 26 : 24 }}>
                      {/* Photo */}
                      <div className="relative overflow-hidden" style={{ height: 300 }}>
                        <EditableImage
                          imageKey={`member_${member.name.toLowerCase().replace(/\s+/g, '_')}`}
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          isAdmin={isAdmin && isCenter}
                          wrapperClassName="w-full h-full group/editimg"
                        />
                      </div>
                      {/* Text */}
                      <div className="p-5 pb-6">
                        <h4 className="font-heading text-xl text-primary leading-tight mb-2">{member.name}</h4>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          "{member.short_quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => go(1)}
            className="absolute right-2 z-20 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link to="/contact">
            <Button
              size="lg"
              className="font-body bg-primary hover:bg-primary/90 gap-2 text-base px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
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
                  src={selected.image_url}
                  alt={selected.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent/30"
                />
                <div>
                  <h3 className="font-heading text-2xl text-primary">{selected.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{selected.profession}</p>
                </div>
              </div>
              <div className="space-y-4">
                {selected.testimony && (
                  <div>
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Their Testimony</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{selected.testimony}</p>
                  </div>
                )}
                {selected.why_hope && (
                  <div className="border-t pt-4">
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Why Hope Church?</p>
                    <p className="font-body text-sm text-foreground leading-relaxed italic">"{selected.why_hope}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}