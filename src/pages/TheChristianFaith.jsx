import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import EditableImage from '@/components/admin/EditableImage';

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-4 overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(38 45% 60%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(38 45% 60%) 0%, transparent 40%)' }} />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-4">
          Understanding Faith
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading text-5xl md:text-7xl text-white mb-6 leading-tight">
          The Christian Faith
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-body text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          A first-principles exploration of humanity's search for God and what is true — tracing the story from the earliest pages of Scripture through four thousand years of living faith.
        </motion.p>
      </div>
    </section>
  );
}

// ─── What is Christianity ────────────────────────────────────────────────────
function IntroSection({ isAdmin }) {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">What is Christianity?</h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
              At its heart, Christianity isn't primarily a set of rules or a moral philosophy. It's a relationship. It begins with the belief that God loves people so much that He became human in the person of Jesus Christ, entered our world, and made a way for broken people to be restored and reconciled to Him.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              For nearly 2,000 years, billions of people across every culture, continent, and walk of life have organized their lives around this central claim: that in Jesus, God showed us who He is and how much He cares.
            </p>
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden group/editimg">
            <EditableImage
              imageKey="faith_intro"
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
              alt="Church interior"
              className="w-full h-full object-cover"
              isAdmin={isAdmin}
              wrapperClassName="relative w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why Christianity is Different ───────────────────────────────────────────
function UniquenessSection() {
  const points = [
    {
      title: "God is Infinitely Good & We Bear His Image",
      desc: "God is infinitely good and created us in His image. This isn't just a philosophical idea—it means we reflect God's character. Every person carries infinite worth because they reflect an infinite God."
    },
    {
      title: "But that makes every sin infinitely serious...",
      desc: "Because God is infinitely good, sin against Him (and against those made in His image) is infinitely serious. It's not just breaking rules—it's transgressing against infinite goodness, which makes the weight of sin incalculable."
    },
    {
      title: "Which we compound with ignorance and arrogance trying to fix it ourselves",
      desc: "Unlike other religions that call you to fix yourself through effort or discipline, Christianity teaches that finite beings cannot right an infinite wrong against a perfectly good God. To try is arrogance. You cannot earn your way back to Him."
    },
    {
      title: "So God bridged the unbridgeable gap",
      desc: "Here's where Christianity is radically different: God Himself came and died to bridge the infinite gap we could never bridge. Through Jesus, God absorbed the full weight of our infinite transgression and made reconciliation possible."
    },
    {
      title: "Which means forgiveness comes through humility, not achievement",
      desc: "We receive forgiveness not by performing or earning it, but by humbly acknowledging we could never bridge the gap ourselves and accepting God's free gift. It requires honest confession of our gravity and complete dependence on His mercy."
    },
    {
      title: "And so we live in grateful response",
      desc: "Once forgiven, Christians live differently—not to earn salvation, but to demonstrate gratitude. A life transformed by grace becomes a living thank you to God. Service, love, and growth flow from having received something we never deserved."
    },
    {
      title: "Making Christianity the only honest path of righteousness",
      desc: "Because our good works flow from gratitude for salvation—not attempts to earn it—Christianity offers the only truly honest path of righteousness. We're freed from transactional love and empowered to live sacrificially and volitionally. The church body, family, and society become places where we aspire to live out these ideals together, even when we fall short."
    },
  ];

  return (
    <section className="py-28 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">Why Christianity is Different</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            If you're unfamiliar with Christianity, here are some key ideas that set it apart.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-accent/10 border border-accent/30 rounded-xl p-6 max-w-2xl mx-auto mb-4"
          >
            <p className="font-body italic text-muted-foreground text-base leading-relaxed">
              "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
            </p>
            <p className="font-body text-xs text-accent font-medium mt-3">— John 3:16</p>
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          {/* The Bad News */}
          <div className="mb-8">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/70 mb-4 ml-20">The Bad News</p>
            {points.slice(0, 3).map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 items-start mb-4"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-sm">
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-0.5 h-16 bg-border/60 mt-2" />}
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 pt-5">
                  <h3 className="font-heading text-lg text-primary mb-2">{point.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* The Good News */}
          <div className="mb-8">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/70 mb-4 ml-20">The Good News</p>
            {points.slice(3, 5).map((point, i) => (
              <motion.div
                key={i + 3}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 items-start mb-4"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-sm">
                    {i + 4}
                  </div>
                  {i < 1 && <div className="w-0.5 h-16 bg-border/60 mt-2" />}
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 pt-5">
                  <h3 className="font-heading text-lg text-primary mb-2">{point.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Thankfulness not Penance */}
          <div className="mb-8">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/70 mb-4 ml-20">Thankfulness not Penance</p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-6 items-start"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-sm">
                  6
                </div>
                <div className="w-0.5 h-16 bg-border/60 mt-2" />
              </div>
              <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 pt-5">
                <h3 className="font-heading text-lg text-primary mb-2">{points[5].title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed text-sm">{points[5].desc}</p>
              </div>
            </motion.div>
          </div>

          {/* Paying it Forward */}
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent/70 mb-4 ml-20">Paying it Forward</p>
            {points.slice(6).map((point, i) => (
              <motion.div
                key={i + 6}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 items-start mb-4"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-sm">
                    {i + 7}
                  </div>
                  {i < 1 && <div className="w-0.5 h-16 bg-border/60 mt-2" />}
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 pt-5">
                  <h3 className="font-heading text-lg text-primary mb-2">{point.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{point.desc}</p>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="flex gap-6 items-start"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-sm">
                  8
                </div>
              </div>
              <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 pt-5">
                <h3 className="font-heading text-lg text-primary mb-2">We are called to forgive and heal as we were healed</h3>
                <p className="font-body text-muted-foreground leading-relaxed text-sm">Because we have been forgiven of infinite wrongs, we are commissioned to forgive others and heal the world as God healed us. Our purpose becomes an echo of His grace—extending mercy, pursuing justice, and mending what sin has broken.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Core Beliefs ───────────────────────────────────────────────────────────
function CoreBeliefsSection() {
  const beliefs = [
    {
      title: "God Exists and Loves You",
      desc: "Christians believe in one God who created everything and cares deeply about people. This isn't a distant, angry God—it's a God who pursues relationship."
    },
    {
      title: "Humans Were Made in God's Image",
      desc: "You matter. Your life has value and purpose because you reflect God's character. This is why Christians care about human dignity and worth."
    },
    {
      title: "We're All Broken and Need Help",
      desc: "The Christian story acknowledges that something is wrong with the world and with us. We all struggle, make mistakes, and hurt others. This isn't shame—it's honesty."
    },
    {
      title: "Jesus is God's Son and Our Rescuer",
      desc: "Christians believe Jesus lived a perfect life, died to bridge the gap between God and humanity, and rose from the dead. Through Him, people find forgiveness and new life."
    },
    {
      title: "Salvation is a Gift, Not Earned",
      desc: "You can't work your way to God. Instead, Christianity offers grace—undeserved love. You receive it by faith, like accepting a gift someone offers."
    },
    {
      title: "The Holy Spirit Lives in Believers",
      desc: "God doesn't leave people alone after they begin following Jesus. The Holy Spirit—God's presence—lives in believers, guiding, comforting, and empowering them."
    },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">Core Beliefs of Christianity</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are the foundational ideas that unite Christians around the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beliefs.map((belief, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border/50 rounded-2xl p-6"
            >
              <h3 className="font-heading text-lg text-primary mb-2">{belief.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{belief.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Denominations ──────────────────────────────────────────────────────────
function DenominationsSection() {
  const denominations = [
    {
      name: "Pentecostal/Charismatic",
      emphasis: "The Emotional & Expressive Experience",
      desc: "These traditions emphasize a vibrant, personal experience of God's presence. Worship is often joyful, expressive, and interactive. They believe in the active work of the Holy Spirit today, including healing and spiritual gifts.",
      appeals: "Artists, musicians, dancers, healers, those who experience God through emotion and movement"
    },
    {
      name: "Catholic",
      emphasis: "Tradition, Ritual & Community Heritage",
      desc: "Catholicism values rich liturgical traditions, sacraments (sacred practices), and centuries of church teaching. There's beauty in repetition and ritual that connects believers to history. The church hierarchy and Mary's role are also important.",
      appeals: "Artists, historians, those drawn to beauty, tradition, and sacred aesthetics"
    },
    {
      name: "Protestant (Many Varieties)",
      emphasis: "Scripture & Personal Faith",
      desc: "Born from the Reformation, Protestants emphasize the Bible as the primary authority and the importance of a personal relationship with God. This includes Baptists, Methodists, Presbyterians, Evangelicals, and others—each with unique flavors.",
      appeals: "Individualists, reformers, those who value personal conviction and Scripture study"
    },
    {
      name: "Orthodox Christian",
      emphasis: "Ancient Tradition & Mystery",
      desc: "With roots in Eastern Christianity, Orthodox traditions emphasize the mystical and transcendent aspects of faith. Icons, liturgy, and unbroken historical continuity with the early church are cherished.",
      appeals: "Contemplatives, mystics, those drawn to mystery, apophatic theology, and ancient wisdom"
    },
    {
      name: "Reformed/Calvinist",
      emphasis: "God's Sovereignty & Intellectual Engagement",
      desc: "These traditions emphasize God's ultimate control and authority. They tend to value deep theological reflection and careful study of Scripture alongside personal faith.",
      appeals: "Intellectuals, philosophers, theologians, those who engage faith through rigorous thinking"
    },
    {
      name: "Evangelical",
      emphasis: "Conversion & Active Discipleship",
      desc: "Evangelicals focus on a personal decision to follow Jesus ('born again') and actively sharing that faith with others. They emphasize the centrality of Jesus' death and resurrection and the authority of the Bible.",
      appeals: "Activists, missionaries, those energized by direct action and relational evangelism"
    },
  ];

  return (
    <section className="py-28 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">The Christian Family: Different Branches, One Root</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Christianity is wonderfully diverse. While all Christians share core beliefs about God and Jesus, different traditions emphasize different aspects of faith. None of these differences makes one "wrong"—they reflect the richness of how faith can be lived.
          </p>
        </motion.div>

        <div className="space-y-4">
          {denominations.map((denom, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border/50 rounded-2xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-heading text-lg text-primary">{denom.name}</h3>
                <p className="font-body text-sm text-accent font-medium mt-1">{denom.emphasis}</p>
                <p className="font-body text-muted-foreground leading-relaxed mt-3">{denom.desc}</p>
                <p className="font-body text-xs text-muted-foreground/70 mt-4 pt-4 border-t border-border/30 italic">Appeals to: {denom.appeals}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Not Christianity: Understanding Cults ──────────────────────────────────
function CultSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const characteristics = [
    {
      title: "Exclusive Truth from One Person",
      desc: "A key warning sign is when a group claims that only one person—a living leader—has special knowledge or revelation from God that contradicts historic Christianity or lacks outside verification. In Christianity, leaders point to Scripture and historical faith, not to themselves as the sole source of truth."
    },
    {
      title: "Secrecy and Hidden Levels of Belief",
      desc: "Legitimate churches are transparent. What you hear on Sunday is what everyone believes. Groups that have secret teachings—things you only learn after proving your loyalty—raise concerns. Christianity has always been an open book."
    },
    {
      title: "Isolation and Control",
      desc: "Groups that discourage members from having outside relationships, asking questions, or leaving are using control tactics. Real faith invites questions and respects freedom. Christianity calls people to healthy relationships and freedom in Christ."
    },
    {
      title: "Changed Core Teachings About God or Jesus",
      desc: "Groups that redefine who God is or downplay Jesus' deity/resurrection in fundamental ways have moved away from Christianity. The person and nature of Jesus has been the constant across 2,000 years of Christian faith."
    },
    {
      title: "Demands for Money or Absolute Obedience",
      desc: "While churches ask for tithes or donations, groups that demand financial 'proof' of faith or absolute obedience to a leader (rather than to God and conscience) are operating outside Christian ethics."
    },
    {
      title: "Lack of Historical Continuity",
      desc: "Christianity traces back 2,000 years through verifiable history and documented Scripture. Groups founded in the last few decades by a single charismatic figure, claiming to correct all previous Christianity, don't align with how God has worked in history."
    },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">What Christianity is Not: Understanding Cults</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Not every group that claims to be Christian is part of historic Christianity. Here's how to recognize the difference—not to judge, but to understand.
          </p>
        </motion.div>

        <div className="space-y-3">
          {characteristics.map((char, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`border rounded-xl overflow-hidden transition-colors ${openIndex === i ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-card'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center gap-4 p-6 text-left"
              >
                <div className="flex-1">
                  <h3 className="font-heading text-lg text-primary">{char.title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-muted-foreground text-sm leading-relaxed px-6 pb-6 pl-20">{char.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-accent/10 border border-accent/30 rounded-2xl p-8"
        >
          <p className="font-body text-muted-foreground leading-relaxed">
            <span className="font-heading text-primary">A Note on Genuine Faith:</span> People in these groups may genuinely believe they're following God. We're not suggesting they're evil—but their groups operate under a different structure and set of claims than historic Christianity. If you're curious about a group or concerned about a loved one, it's wise to ask questions, verify claims against Scripture, and check their openness to scrutiny.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Historical Timeline ────────────────────────────────────────────────────
function HistorySection({ isAdmin }) {
  const [activeEra, setActiveEra] = useState(0);

  const eras = [
    {
      title: "Ancient Foundations: The Old Testament Story",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      points: [
        "Long before Jesus, God made promises to a man named Abraham—that his family would become a blessing to the world.",
        "Moses led people out of slavery and received the Ten Commandments—God's moral guidance.",
        "Kings like David united the people, and prophets spoke messages of hope and warning.",
        "Through centuries of ups and downs, God consistently called His people back to Himself.",
        "These stories weren't random—they were setting the stage for something bigger: the arrival of Jesus."
      ]
    },
    {
      title: "The Central Story: Jesus Arrives",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
      points: [
        "Jesus was born in Bethlehem around 2,000 years ago. He lived a humble life—as a carpenter, then as a teacher.",
        "He taught about God's love, healed the sick, and challenged systems of power and religious hypocrisy.",
        "His core message: God loves you so much that He wants a relationship with you. You matter.",
        "He was crucified—a brutal, shameful death. His followers were devastated.",
        "But then, something extraordinary happened: He rose from the dead. Not as a ghost, but physically alive. This proved His claim that He was God's Son and that He had conquered death itself.",
        "This resurrection changed everything. It became the cornerstone of Christian hope."
      ]
    },
    {
      title: "The Early Church: Good News Spreads",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      points: [
        "After Jesus ascended to heaven, His followers gathered in Jerusalem. They were filled with courage and joy, despite danger.",
        "On the day of Pentecost, the Holy Spirit empowered them to speak boldly. About 3,000 people became followers that day.",
        "The apostles—especially Peter and Paul—traveled throughout the Roman Empire, sharing the message of Jesus.",
        "Communities of believers formed, meeting in homes, sharing meals, and caring for one another.",
        "Despite persecution, the message spread like wildfire. By the end of the first century, there were Christians from Spain to India.",
        "The early believers wrote letters (now part of the New Testament) that guided new churches and deepened faith."
      ]
    },
    {
      title: "Shaping the World: Key Moments in Christendom",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      points: [
        "Constantine (300s): The Roman Emperor legalized Christianity. It went from persecuted minority to accepted faith.",
        "Medieval Period: The Church became deeply embedded in European culture. Some beautiful things happened (art, education, hospitals), and some troubling things too (corruption, misuse of power).",
        "The Great Schism (1054): Eastern and Western Christianity split, creating the Orthodox and Catholic traditions.",
        "The Reformation (1500s): A monk named Martin Luther challenged church practices and called for reform. This sparked Protestantism—a return to Scripture and personal faith.",
        "Age of Discovery: Christian missionaries traveled globally, sometimes spreading faith, sometimes entangled with colonialism.",
        "Modern Era: Christianity became truly global. Today, more Christians live outside Europe than within it."
      ]
    },
    {
      title: "Christianity Today: A Global Movement",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&q=80",
      points: [
        "Over 2.4 billion Christians worldwide—roughly 1/3 of humanity.",
        "Christianity is growing fastest in Africa, Asia, and Latin America.",
        "Churches today range from massive stadiums to small home groups. Some are traditional, some contemporary, some blended.",
        "Christians are engaged in education, healthcare, disaster relief, justice work, and community building.",
        "The faith continues to evolve and adapt while staying rooted in its historic foundations.",
        "For many, Christianity remains a source of hope, purpose, community, and peace in a complicated world."
      ]
    },
  ];

  return (
    <section className="py-28 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">A Tapestry of History</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Christianity is a real religion—rooted in real people, real places, and real lessons lived across millennia. These truths aren't abstract ideals; they're proven through centuries of consistency and persistence. Their potency has only been enhanced by their endurance.
          </p>
        </motion.div>

        {/* Era Selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {eras.map((era, i) => (
            <button
              key={i}
              onClick={() => setActiveEra(i)}
              className={`font-body text-sm px-4 py-2 rounded-full border transition-all ${
                activeEra === i
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              {era.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Era Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEra}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl text-primary mb-4">{eras[activeEra].title}</h3>
            </div>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden group/editimg">
              <EditableImage
                imageKey={`faith_era_${activeEra}`}
                src={eras[activeEra].image}
                alt={eras[activeEra].title}
                className="w-full h-full object-cover"
                isAdmin={true}
                wrapperClassName="relative w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            <div className="space-y-4">
              {eras[activeEra].points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="font-body text-muted-foreground leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Closing Section ────────────────────────────────────────────────────────
function ClosingSection() {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">What Happens Next?</h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Whether you're deeply curious, skeptical, or somewhere in between, Christianity invites you to explore and ask questions. Faith isn't about blind acceptance—it's about an honest search for truth and meaning.
          </p>
          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            If you'd like to learn more, attend a service, ask questions, or simply observe, you're welcome here. We believe faith is best explored in community—with people who genuinely want to know you and walk alongside you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TheChristianFaith() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u && ['admin', 'staff', 'pastor'].includes(u.role?.toLowerCase())) setIsAdmin(true);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <IntroSection isAdmin={isAdmin} />
      <UniquenessSection />
      <CoreBeliefsSection />
      <DenominationsSection />
      <CultSection />
      <HistorySection isAdmin={isAdmin} />
      <ClosingSection />
    </div>
  );
}