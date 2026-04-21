import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cross, BookOpen, Heart, Globe, Users, Zap } from 'lucide-react';

const beliefs = [
  {
    icon: BookOpen,
    title: "The Authority of Scripture",
    summary: "We believe the Bible is the inspired, inerrant Word of God.",
    detail: "We believe the 66 books of the Old and New Testaments are the divinely inspired Word of God — fully trustworthy, sufficient, and our final authority for all matters of faith and practice. Scripture is not merely a human record, but God's self-revelation to humanity."
  },
  {
    icon: Cross,
    title: "The Trinity",
    summary: "One God in three persons — Father, Son, and Holy Spirit.",
    detail: "We believe in one God who exists eternally in three co-equal, co-eternal persons: God the Father, God the Son (Jesus Christ), and God the Holy Spirit. Each person is distinct yet of one divine nature, united in purpose, love, and glory."
  },
  {
    icon: Heart,
    title: "Salvation by Grace Through Faith",
    summary: "We are saved by grace alone, through faith alone, in Christ alone.",
    detail: "We believe that all humanity has sinned and fallen short of God's glory, and that salvation is God's free gift — not earned by works. Jesus Christ, fully God and fully man, died as our substitute and rose bodily from the dead. All who place their faith in Him are forgiven, justified, and given eternal life."
  },
  {
    icon: Zap,
    title: "The Resurrection & Return of Christ",
    summary: "Jesus rose bodily and will return to make all things new.",
    detail: "We believe in the literal, bodily resurrection of Jesus Christ as the cornerstone of Christian faith. He ascended to the right hand of the Father and will return personally, visibly, and gloriously. His resurrection guarantees the resurrection of all who believe, and the renewal of all creation."
  },
  {
    icon: Users,
    title: "The Church & Community",
    summary: "The Church is the Body of Christ, called to love and serve the world.",
    detail: "We believe the universal Church is the community of all true believers in Jesus Christ, and that the local church is God's primary vehicle for discipleship, worship, and mission. We are called to love one another deeply, serve our neighbors sacrificially, and proclaim the Gospel to all people."
  },
  {
    icon: Globe,
    title: "The Mission of God",
    summary: "We are sent to be witnesses in Santa Barbara and to the ends of the earth.",
    detail: "We believe God is on a mission to redeem and restore all things, and that He invites His people to participate. Every follower of Jesus is called to make disciples, pursue justice, care for the vulnerable, and be a blessing to their city and to the nations. At Hope Church, we take seriously our calling to Santa Barbara and beyond."
  },
];

function BeliefAccordion({ belief, isOpen, onToggle, index }) {
  const Icon = belief.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-card'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-6 text-left"
      >
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-0 pl-20">
              <p className="font-body text-muted-foreground leading-relaxed text-sm">
                {belief.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BeliefsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">What We Believe</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            Core Doctrinal Beliefs
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We hold to the historic Christian faith as summarized in the great creeds of the church. 
            These convictions aren't walls to keep people out — they're anchors that hold us steady 
            and unite us in truth and love.
          </p>
        </motion.div>

        <div className="space-y-3">
          {beliefs.map((belief, index) => (
            <BeliefAccordion
              key={belief.title}
              belief={belief}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="font-body text-sm text-muted-foreground">
            Have questions about what we believe?{' '}
            <a href="/contact" className="text-accent underline-offset-2 hover:underline">We'd love to talk.</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}