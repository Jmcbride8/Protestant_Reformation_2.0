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

        {/* Personal profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-8 mb-10 flex flex-col md:flex-row gap-8 items-start"
        >
          <div className="flex-shrink-0 w-36 h-36 rounded-full overflow-hidden bg-muted group/editimg">
            <EditableImage
              imageKey="vision_creator_photo"
              src={null}
              alt="Creator photo"
              className="w-full h-full object-cover"
              wrapperClassName="relative w-full h-full"
              isAdmin={isAdmin}
            />
          </div>
          <div className="flex-1">
            <p className="font-body text-xs tracking-widest uppercase text-accent mb-2">Why I Built This</p>
            <EditableText
              storageKey="bg_para1"
              defaultText="My relationship with church has always been relational before institutional. A formative experience to my relationship with church was joining VIVE Church in San Jose when it was just twenty people gathering with a shared conviction that something meaningful was possible. Watching it grow was extraordinary. But growth, unchecked by intentional relational infrastructure, imposed a quiet cost: the larger a congregation became, the easier it was for individuals to become anonymous and new members to feel disconnected."
              className="font-body text-muted-foreground leading-relaxed mb-4"
              isAdmin={isAdmin}
            />
            <EditableText
              storageKey="bg_para2"
              defaultText="Having worked in startups, that observation wasn't unique to church — as is often the case, people tend to feel nostalgic about earlier times when the organization was smaller and relationships more organic. The Sunday service, the worship, the teaching — these are irreplaceable. What this site attempts to add is the connective tissue in between: the midweek ride to church, the meal offered to a family in need, the small group that becomes a second family. It's not about doing church differently. It's about doing more of what church has always done best — caring for people — and giving that care a practical, accessible home online and an emphasis on the main page as a reminder to ourselves to keep the main thing the main thing."
              className="font-body text-muted-foreground leading-relaxed mb-4"
              isAdmin={isAdmin}
            />
            <EditableText
              storageKey="bg_quote"
              defaultText={`"The goal was never to replace what's sacred about gathering together. It was to extend it into the six days between Sundays."`}
              className="font-body text-muted-foreground leading-relaxed italic"
              isAdmin={isAdmin}
            />
          </div>
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
            defaultText={`VIVE Church is a thriving, well-run congregation with excellent production quality, strong teaching, and a genuinely enthusiastic culture. It is, in many ways, a model of what a modern church can be. The pastors were genuinely hospitable individuals, however they were still human and could only cover so much ground. This raised a question they struggled to solve: "As we grow, how do we keep church a family and not an impersonal institution?". This site is not an answer, but an experiment in building relational infrastructure alongside inspirational programming — so that the warmth of a 5 person gathering doesn't get lost in a congregation of dozens or thousands. Even their design aesthetic followed this arc: early on it carried a hand-crafted warmth; as they scaled, it became sleeker, cooler, more corporate. That shift is common, but — like the best architectural firms that manage to build at scale without losing soul — I don't think it's inevitable. You can grow and still feel like home.`}
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

        {/* Francis Chan Challenge as second example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">A Radical Reimagining</p>
          <h3 className="font-heading text-2xl text-primary mb-3">From the Megachurch to the Margin</h3>
          <EditableText
            storageKey="bg_francis_chan"
            defaultText={`Francis Chan walked away from a thriving megachurch to ask a harder question: What if the church looked less like an organization and more like a family? He abandoned the stage, the crowds, and the comfort to return to something ancient and radical — a church small enough to know people's names, brave enough to live generously, and faithful enough to make disciples, not just decisions. His challenge isn't about condemning growth — it's about asking whether we're willing to prioritize relationships over reach, intimacy over influence. Hope Church exists in that tension: not abandoning the gifts that come with intentional leadership and teaching, but ensuring that the structure serves community, not the other way around.`}
            className="font-body text-muted-foreground leading-relaxed max-w-3xl"
            isAdmin={isAdmin}
          />
        </motion.div>

      </div>
    </section>
  );
}