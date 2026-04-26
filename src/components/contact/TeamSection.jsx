import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function TeamMemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary mb-4 ring-4 ring-background shadow-md">
        {member.photo_url
          ? <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <span className="font-heading text-4xl text-primary/40">{member.full_name?.[0]}</span>
            </div>
        }
      </div>
      <h4 className="font-heading text-lg text-primary">{member.full_name}</h4>
      <p className="font-body text-sm text-accent mt-0.5">{member.role}</p>
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

  if (pastors.length === 0 && staff.length === 0) return null;

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Our People</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary">
            Meet the <span className="italic">Team</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            We'd love to get to know you. Don't hesitate to reach out through the form below.
          </p>
        </motion.div>

        {pastors.length > 0 && (
          <div className="mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground font-semibold text-center mb-10">Pastoral Team</p>
            <div className="flex flex-wrap justify-center gap-10">
              {pastors.map((m, i) => <TeamMemberCard key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}

        {staff.length > 0 && (
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground font-semibold text-center mb-10">Staff</p>
            <div className="flex flex-wrap justify-center gap-10">
              {staff.map((m, i) => <TeamMemberCard key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}