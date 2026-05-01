import React from 'react';
import { motion } from 'framer-motion';
import EditableText from './EditableText';
import EditableImage from '@/components/admin/EditableImage';

export default function VisionBackground({ isAdmin }) {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">The Story Behind It</p>
          <h2 className="font-heading text-4xl text-primary mb-5">Background & Inspiration</h2>
          <EditableText
            storageKey="bg_intro"
            defaultText="Every design has a story. This one begins not with a technology, but with a community."
            className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Why I Built This */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">Why I Built This</p>
          <h3 className="font-heading text-2xl text-primary mb-6">The Problem I Saw</h3>
          
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden bg-muted group/editimg mb-6">
            <EditableImage
              imageKey="vision_creator_photo"
              src={null}
              alt="Creator photo"
              className="w-full h-full object-cover"
              wrapperClassName="relative w-full h-full"
              isAdmin={isAdmin}
            />
          </div>
          
          <EditableText
            storageKey="bg_para1"
            defaultText="I joined VIVE Church in San Jose when it was just twenty people. Watching it grow was extraordinary. But growth without intentional relational infrastructure carries a hidden cost: the larger a congregation becomes, the easier it is for people to feel anonymous."
            className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-6"
            isAdmin={isAdmin}
          />
          <EditableText
            storageKey="bg_para2"
            defaultText="Every growing organization faces this challenge. The Sunday service is irreplaceable — but what about Tuesday? The meal for a family in crisis? The ride to church? The small group that becomes a second family? This site adds the connective tissue: a practical home for the care that's always been at the heart of church."
            className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-8"
            isAdmin={isAdmin}
          />

          <EditableText
            storageKey="bg_quote"
            defaultText={`"The question isn't whether rows or circles are better — it's whether we can have both. Large gatherings for inspiration, small circles for intimacy. This site is built to help that vision work in practice."`}
            className="font-body text-muted-foreground leading-relaxed max-w-3xl italic mb-16"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* VIVE Church section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">A Formative Example</p>
          <h3 className="font-heading text-2xl text-primary mb-3">VIVE Church</h3>
          <EditableText
            storageKey="bg_vive_v2"
            defaultText={`VIVE Church is thriving, well-led, and genuinely welcoming. The pastors are truly hospitable people — but they're still human, and as the church grew, they couldn't reach everyone the way they once could. Like most growing congregations, it faced a real question: "How do we keep feeling like a family as we grow?" This site experiments with that very problem — building relational infrastructure that lets warmth scale. You can grow and still feel like home.`}
            className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-8"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Three uploadable VIVE images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { label: 'The Community', hint: 'Upload a photo of VIVE Church or congregation', key: 'vive_community' },
            { label: 'The Gathering', hint: 'Upload a worship or event photo', key: 'vive_gathering' },
            { label: 'The Digital Presence', hint: 'Upload a screenshot of the VIVE website', key: 'vive_digital' },
          ].map((slot, i) => (
            <motion.div
              key={slot.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-2"
            >
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted group/editimg">
                <EditableImage
                  imageKey={`vision_${slot.key}`}
                  src={null}
                  alt={slot.label}
                  className="w-full h-full object-cover"
                  wrapperClassName="relative w-full h-full"
                  isAdmin={isAdmin}
                />
              </div>
              <p className="font-body text-xs font-medium text-foreground">{slot.label}</p>
              <p className="font-body text-xs text-muted-foreground">{slot.hint}</p>
            </motion.div>
          ))}
        </div>

        {/* Baptist Campus Ministries section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-4"
         >
           <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">A Radical Reimagining</p>
           <h3 className="font-heading text-2xl text-primary mb-3">The Francis Chan Challenge</h3>
           
           <div className="grid lg:grid-cols-2 gap-12 items-start mb-8">
             {/* Video */}
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/30"
             >
               <iframe
                 width="100%"
                 height="100%"
                 src="https://www.youtube.com/embed/P5GD9ftscFQ?si=OrPiuXXfWWbSEBA7"
                 title="Francis Chan Challenge"
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 referrerPolicy="strict-origin-when-cross-origin"
                 allowFullScreen
                 className="absolute inset-0"
               />
             </motion.div>

             {/* Text content */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex flex-col justify-center space-y-5"
             >
               <EditableText
                 storageKey="bg_francis_why_left"
                 defaultText="Francis Chan's challenge at Cornerstone Church is instructive: how do you preserve family warmth at scale? He left to solve it from scratch."
                 className="font-body text-muted-foreground leading-relaxed"
                 isAdmin={isAdmin}
               />
               <EditableText
                 storageKey="bg_francis_call"
                 defaultText="It's not unique to megachurches. Even small congregations drift toward anonymity. How do you create real family, not just the appearance of it?"
                 className="font-body text-muted-foreground leading-relaxed"
                 isAdmin={isAdmin}
               />
               <EditableText
                 storageKey="bg_francis_hope"
                 defaultText="Growth is good. You don't have to choose between scale and family. With the right infrastructure, they work together."
                 className="font-body text-muted-foreground leading-relaxed italic"
                 isAdmin={isAdmin}
               />
             </motion.div>
           </div>
         </motion.div>

         {/* Baptist Campus Ministries section */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-4"
         >
           <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">The Value of Scale</p>
           <h3 className="font-heading text-2xl text-primary mb-3">Baptist Campus Ministries</h3>
           <EditableText
             storageKey="bg_bcm_intro"
             defaultText="At Georgia Tech and University of West Georgia, I watched Baptist Campus Ministries build physical homes at the heart of campus. Over decades, the universities literally grew around them. They persisted. This teaches something the small-group movement sometimes overlooks: scale and structure have their own power."
             className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-6"
             isAdmin={isAdmin}
           />
           <EditableText
             storageKey="bg_bcm_insight"
             defaultText="Small groups are intimate but fragile. Networks have warmth but no spine. The BCM buildings had staying power — they could invest in culture over decades. The real question isn't rows versus circles. It's building infrastructure strong enough to hold both."
             className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-8"
             isAdmin={isAdmin}
           />
         </motion.div>

         {/* Three uploadable BCM images */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
           {[
             { label: 'Georgia Tech BCM', hint: 'Upload a photo of the Georgia Tech Baptist Campus Ministry', key: 'bcm_georgia_tech' },
             { label: 'UWG BCM', hint: 'Upload a photo of the University of West Georgia Baptist Campus Ministry', key: 'bcm_uwg' },
             { label: 'Campus Impact', hint: 'Upload a photo showing the BCM buildings in their campus context', key: 'bcm_campus_impact' },
           ].map((slot, i) => (
             <motion.div
               key={slot.label}
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
               className="flex flex-col gap-2"
             >
               <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted group/editimg">
                 <EditableImage
                   imageKey={`vision_${slot.key}`}
                   src={null}
                   alt={slot.label}
                   className="w-full h-full object-cover"
                   wrapperClassName="relative w-full h-full"
                   isAdmin={isAdmin}
                 />
               </div>
               <p className="font-body text-xs font-medium text-foreground">{slot.label}</p>
               <p className="font-body text-xs text-muted-foreground">{slot.hint}</p>
             </motion.div>
           ))}
         </div>

      </div>
    </section>
  );
}