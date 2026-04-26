import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // On desktop show up to 3 at a time; on mobile show 1
  const visibleCount = Math.min(members.length, 3);
  const visible = Array.from({ length: visibleCount }, (_, i) =>
    members[(index + i) % members.length]
  );

  return (
    <div>
      {/* Desktop: up to 3 cards side by side */}
      <div className="hidden sm:flex items-center justify-center gap-4">
        {members.length > visibleCount && (
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 text-white" />
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
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Mobile: single card */}
      <div className="sm:hidden flex items-center justify-center gap-4">
        {members.length > 1 && (
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        <motion.div key={members[index].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <TeamMemberCard member={members[index]} />
        </motion.div>
        {members.length > 1 && (
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Dots */}
      {members.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-accent' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamSection() {
  const { data: members = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.MemberProfile.filter({ is_directory_visible: true }),
  });

  const pastors = members.filter(m => m.role === 'Pastor');
  const staff = members.filter(m => m.role === 'Staff' || m.role === 'Admin');

  return (
    <section className="py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-white/50 mb-4">Contact</p>
          <h1 className="font-heading text-5xl sm:text-7xl text-white mb-6">
            Meet the <span className="italic text-accent">Team</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-xl mx-auto">
            Real people. Open doors. We'd love to get to know you.
          </p>
        </motion.div>

        {pastors.length > 0 && (
          <div className="mb-20">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-white/40 font-semibold text-center mb-12">Pastoral Team</p>
            <TeamCarousel members={pastors} />
          </div>
        )}

        {staff.length > 0 && (
          <div>
            {pastors.length > 0 && <div className="w-16 h-px bg-white/20 mx-auto mb-16" />}
            <p className="font-body text-xs tracking-[0.25em] uppercase text-white/40 font-semibold text-center mb-12">Staff</p>
            <TeamCarousel members={staff} />
          </div>
        )}
      </div>
    </section>
  );
}