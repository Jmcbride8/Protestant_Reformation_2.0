import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function TeamMemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-36 h-36 rounded-full overflow-hidden bg-white/10 mb-4 ring-4 ring-white/20 shadow-xl">
        {member.photo_url
          ? <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <span className="font-heading text-4xl text-white/50">{member.full_name?.[0]}</span>
            </div>
        }
      </div>
      <h4 className="font-heading text-xl text-white">{member.full_name}</h4>
      <p className="font-body text-sm text-white/60 mt-0.5 tracking-wide">{member.role}</p>
    </motion.div>
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
      {/* Subtle background texture */}
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
            <div className="flex flex-wrap justify-center gap-12">
              {pastors.map((m, i) => <TeamMemberCard key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}

        {staff.length > 0 && (
          <div>
            {pastors.length > 0 && (
              <div className="w-16 h-px bg-white/20 mx-auto mb-16" />
            )}
            <p className="font-body text-xs tracking-[0.25em] uppercase text-white/40 font-semibold text-center mb-12">Staff</p>
            <div className="flex flex-wrap justify-center gap-12">
              {staff.map((m, i) => <TeamMemberCard key={m.id} member={m} index={pastors.length + i} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}