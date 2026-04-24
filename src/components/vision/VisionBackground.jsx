import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';
import EditableText from './EditableText';

function UploadableImage({ src, storageKey, onUpload, alt, aspectClass = 'aspect-square', rounded = 'rounded-2xl' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const lsKey = storageKey ? `vision_img_${storageKey}` : null;
  const [preview, setPreview] = useState(() => (lsKey && localStorage.getItem(lsKey)) || src);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPreview(file_url);
    if (lsKey) localStorage.setItem(lsKey, file_url);
    onUpload && onUpload(file_url);
    setUploading(false);
  };

  return (
    <div className={`relative group ${aspectClass} ${rounded} overflow-hidden bg-muted cursor-pointer`} onClick={() => inputRef.current?.click()}>
      {preview
        ? <img src={preview} alt={alt} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-6 h-6" />
            <span className="font-body text-xs">Upload photo</span>
          </div>
      }
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {uploading
          ? <span className="font-body text-xs text-white">Uploading…</span>
          : <div className="flex flex-col items-center gap-1 text-white">
              <Upload className="w-5 h-5" />
              <span className="font-body text-xs">Replace</span>
            </div>
        }
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

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
          <div className="flex-shrink-0 w-36 h-36">
            <UploadableImage
              src={null}
              storageKey="creator_photo"
              alt="Creator photo"
              aspectClass="w-36 h-36"
              rounded="rounded-full"
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
            storageKey="bg_vive"
            defaultText={`VIVE Church is a thriving, well-run congregation with excellent production quality, strong teaching, and a genuinely warm culture. It is, in many ways, a model of what a modern church can be. The reflection here is not a criticism — it's the natural question that success raises: "As we grow, how do we make sure no one falls through the cracks?" The answer, I believe, lies in building relational infrastructure alongside inspirational programming — so that the warmth of a 20-person gathering doesn't get lost in a congregation of thousands.`}
            className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-8"
            isAdmin={isAdmin}
          />
        </motion.div>

        {/* Three uploadable VIVE images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <UploadableImage
                src={null}
                storageKey={slot.key}
                alt={slot.label}
                aspectClass="aspect-video w-full"
                rounded="rounded-xl"
              />
              <p className="font-body text-xs font-medium text-foreground">{slot.label}</p>
              <p className="font-body text-xs text-muted-foreground">{slot.hint}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}