import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, Users, AlertTriangle, Crown, Gift, Flame } from 'lucide-react';
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
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-heading text-xl sm:text-2xl italic text-white/80 max-w-2xl mx-auto leading-relaxed">
          "My kingdom is not of this world." — John 18:36
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

            <p className="font-body text-sm tracking-[0.2em] uppercase text-accent/60 mb-3">A Journey</p>

            <div className="relative h-80 rounded-2xl overflow-hidden group/editimg mb-8">
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

            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
              It's a journey. And every journey begins with a departure — a leaving of somewhere that is no longer home. Humanity was created in the image of an infinitely good God, placed in a world of beauty and belonging. Then a choice: to trust God, or to go our own way. We went our own way. And in doing so, we didn't just break a rule — we became exiles. Every restlessness, every longing, every sense that this world is not quite right carries the echo of that departure.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              But God didn't abandon the wanderers. People began recording their encounters with Him — promises He made, promises He kept — compiled over centuries into what we call Scripture. A thread of hope running through the long road of history: God was coming to meet us. He was going to make a way home.
            </p>

            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-8">
              <p className="font-heading text-xl sm:text-2xl italic text-primary leading-snug">
                "We ain't what we oughta be. We ain't what we want to be. We ain't what we gonna be. But, thank God, we ain't what we was."
              </p>
              <p className="font-body text-xs text-accent font-medium mt-3">— Often attributed to Martin Luther King Jr.</p>
            </div>

            <p className="font-body text-sm tracking-[0.2em] uppercase text-accent/60 mb-3">With a Person</p>

            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
              And then He came. Not as a distant deity issuing directions, but as a fellow traveler — Jesus Christ — God inhabiting flesh, walking the road with us. He called people to follow Him, healed the broken along the way, challenged those who had made themselves comfortable with the wrong things, and died to clear the path that sin had blocked. Then He rose. And the destination came into view.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              His followers formed communities of travelers — not institutions, but fellow pilgrims — committed to making the journey together. They spread across the earth, not conquering but accompanying, carrying forgiveness, sacrifice, and light into every dark road they walked. It became the largest movement in human history.
            </p>

            <p className="font-body text-sm tracking-[0.2em] uppercase text-accent/60 mb-3">To a Heavenly Kingdom</p>
            <div className="bg-primary rounded-xl p-6">
              <p className="font-body text-white/80 leading-relaxed text-base italic mb-4">
                "All these people were still living by faith when they died. They did not receive the things promised; they only saw them and welcomed them from a distance, admitting that they were foreigners and strangers on earth. People who say such things show that they are looking for a country of their own... they were longing for a better country — a heavenly one. Therefore God is not ashamed to be called their God, for he has prepared a city for them."
              </p>
              <p className="font-body text-xs text-accent font-medium">— Hebrews 11:13–16</p>
            </div>
          </div>


        </motion.div>
      </div>
    </section>
  );
}

// ─── Kingdom Quote ───────────────────────────────────────────────────────────
function KingdomQuote() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-heading text-2xl sm:text-3xl italic text-white leading-snug mb-4">
            "My kingdom is not of this world."
          </p>
          <p className="font-body text-sm text-accent font-medium">— John 18:36, Jesus</p>
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

// ─── Key Values ──────────────────────────────────────────────────────────────
function KeyValuesSection() {
  const values = [
    {
      icon: Heart,
      number: "I",
      title: "Love Above All Else",
      desc: "Jesus summed up all of Scripture in two commands: love God with all you are, and love your neighbor as yourself. For Christians, love isn't a feeling—it's the fundamental value that drives how we live, forgive, and treat others.",
      verse: "\"Love the Lord your God... and love your neighbor as yourself.\" — Matthew 22:37–39",
      dark: true,
    },
    {
      icon: Users,
      number: "II",
      title: "Community Over Individualism",
      desc: "Christians are called to live in community, not isolation. The church is a family—a body where different members use their gifts to serve one another. Nobody is meant to walk alone.",
      verse: "\"As a body, though one, has many parts...\" — 1 Corinthians 12:12",
      dark: false,
    },
    {
      icon: AlertTriangle,
      number: "III",
      title: "Honesty and Humility",
      desc: "Christians believe in being honest about our failures and limitations. Humility isn't weakness—it's the strength to acknowledge we can't fix everything ourselves and need God and each other.",
      verse: "\"Confess your sins to one another and pray for one another.\" — James 5:16",
      dark: true,
    },
    {
      icon: Crown,
      number: "IV",
      title: "Mercy and Forgiveness",
      desc: "Because Christians have received unlimited forgiveness, we're called to extend it to others. Mercy isn't about condoning harm—it's about breaking cycles of hurt and choosing reconciliation.",
      verse: "\"Forgive as the Lord forgave you.\" — Colossians 3:13",
      dark: false,
    },
    {
      icon: Gift,
      number: "V",
      title: "Justice and Advocacy",
      desc: "Christians are called to speak up for the voiceless, care for the poor, and work toward justice. This isn't politics—it's following Jesus' example of standing with the marginalized and vulnerable.",
      verse: "\"Defend the weak and the fatherless; uphold the cause of the poor.\" — Psalm 82:3",
      dark: true,
    },
    {
      icon: Flame,
      number: "VI",
      title: "Stewardship and Generosity",
      desc: "Everything belongs to God, and we're caretakers of it. Christians are called to use their time, talents, and resources generously—not out of obligation, but as joyful expressions of gratitude.",
      verse: "\"It is more blessed to give than to receive.\" — Acts 20:35",
      dark: false,
    },
  ];

  return (
    <section className="py-28 bg-primary overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">How We Live</p>
          <h2 className="font-heading text-4xl sm:text-6xl text-white mb-6">Key Values of Christianity</h2>
          <p className="font-body text-lg text-white/60 max-w-2xl mx-auto">
            Beyond doctrine, here's what Christians actually value and practice in daily life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/10">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative p-8 sm:p-10 group ${value.dark ? 'bg-primary' : 'bg-white/5'}`}
              >
                {/* Roman numeral watermark */}
                <span className="absolute top-6 right-8 font-heading text-6xl font-bold text-white/5 select-none pointer-events-none">
                  {value.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-2xl text-white mb-3 leading-tight">{value.title}</h3>
                <p className="font-body text-white/65 leading-relaxed mb-6 text-sm">{value.desc}</p>

                {/* Verse */}
                <div className="border-t border-white/10 pt-5">
                  <p className="font-body text-xs text-accent/80 italic">{value.verse}</p>
                </div>
              </motion.div>
            );
          })}
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
            Christianity is wonderfully diverse. While all Christians share core beliefs about God and Jesus, different traditions emphasize or express different aspects of faith.
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
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Not every group that claims to be Christian is part of historic Christianity. Here's how to recognize the difference.
          </p>
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 max-w-2xl mx-auto">
            <p className="font-body italic text-muted-foreground text-base leading-relaxed">
              "Watch out for false prophets. They come to you in sheep's clothing, but inwardly they are ferocious wolves. By their fruit you will recognize them."
            </p>
            <p className="font-body text-xs text-accent font-medium mt-3">— Matthew 7:15–16</p>
          </div>
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
            <span className="font-heading text-primary">A Note on Genuine Faith:</span> Some people in these groups may genuinely believe they're following God, while some may be intentionally evil or malicious - but the road is narrow, and not everyone who claims to follow Christ actually is. If you're curious about a group or concerned about a loved one, it's wise to ask questions, verify claims against Scripture, and check their openness to scrutiny.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Historical Tapestry Cards ──────────────────────────────────────────────
function HistorySection({ isAdmin }) {
  const [expanded, setExpanded] = useState(null);

  const cards = [
    {
      key: 'hist_abraham',
      year: 'c. 2000 BC',
      name: 'Abraham',
      subtitle: 'Father of Faith',
      desc: 'God called Abraham out of Ur and made an extraordinary covenant: through his family, all nations on earth would be blessed. He left everything familiar, trusting a God he was only beginning to know. His willingness to obey — even when it made no sense — became the archetype of faith itself.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    },
    {
      key: 'hist_moses',
      year: 'c. 1300 BC',
      name: 'Moses & the Exodus',
      subtitle: 'Liberation & the Law',
      desc: 'God heard the cries of enslaved Israelites in Egypt and sent Moses to lead them out. Through dramatic signs and a sea divided, Israel was freed. At Sinai, God gave the Ten Commandments — moral bedrock that would shape Western civilization for millennia.',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    },
    {
      key: 'hist_david',
      year: 'c. 1000 BC',
      name: 'King David',
      subtitle: 'A Heart After God',
      desc: 'Shepherd, warrior, poet, king. David united the twelve tribes of Israel and established Jerusalem as its capital. Despite profound moral failures, he repented deeply. His psalms — raw, honest, searching — remain the most widely read poetry in human history.',
      image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=80',
    },
    {
      key: 'hist_isaiah',
      year: 'c. 740–700 BC',
      name: 'Isaiah the Prophet',
      subtitle: 'The Voice of Hope',
      desc: 'Isaiah wrote of a suffering servant who would bear the sins of many — a vision so precise it reads like history written in advance. Seven centuries before Jesus, he described a child to be born: Wonderful Counselor, Mighty God, Prince of Peace.',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    },
    {
      key: 'hist_jesus',
      year: 'c. 4 BC – AD 30',
      name: 'Jesus of Nazareth',
      subtitle: 'God Made Flesh',
      desc: 'The hinge of all history. Born in Bethlehem, raised in obscurity, revealed in glory. He healed the sick, befriended the outcast, and taught with unmatched authority. He was crucified under Roman law — and on the third day, rose bodily from the dead. His resurrection is the cornerstone on which Christianity rests.',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
    },
    {
      key: 'hist_pentecost',
      year: 'AD 33',
      name: 'Pentecost',
      subtitle: 'The Church Is Born',
      desc: 'Fifty days after Passover, the risen Jesus\' followers gathered in Jerusalem. The Holy Spirit descended like fire. Peter stood and preached — and three thousand people believed in a single day. The Church had begun, not as an institution, but as a family of Spirit-empowered witnesses.',
      image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
    },
    {
      key: 'hist_paul',
      year: 'AD 35–67',
      name: 'The Apostle Paul',
      subtitle: 'Architect of the Faith',
      desc: 'A persecutor of Christians encountered the risen Jesus on the road to Damascus and was completely transformed. Paul traveled thousands of miles across the Roman Empire planting churches, writing letters that became Scripture, and articulating the theology of grace with unmatched clarity.',
      image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80',
    },
    {
      key: 'hist_constantine',
      year: 'AD 312',
      name: 'Constantine',
      subtitle: 'Christianity Legalized',
      desc: 'Before Constantine, Christians faced systematic execution. The Roman Emperor\'s conversion and the Edict of Milan in 313 AD ended three centuries of persecution and transformed Christianity from a hunted sect into the faith of an empire. A pivotal and complicated turning point.',
      image: 'https://images.unsplash.com/photo-1552083374-1447ce886485?w=800&q=80',
    },
    {
      key: 'hist_augustine',
      year: 'AD 354–430',
      name: 'Augustine of Hippo',
      subtitle: 'Theology\'s Master',
      desc: 'One of history\'s greatest intellectuals, Augustine wrestled honestly with God before surrendering: "Our heart is restless until it rests in Thee." His writings on grace, sin, and the nature of God shaped both Catholic and Protestant thought for 1,600 years.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    },
    {
      key: 'hist_schism',
      year: 'AD 1054',
      name: 'The Great Schism',
      subtitle: 'East & West Divide',
      desc: 'After centuries of tension over theology, authority, and culture, the Eastern and Western churches formally split. Rome became the center of the Catholic Church; Constantinople the center of Eastern Orthodoxy. Two great streams of Christianity — each preserving something the other might neglect.',
      image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    },
    {
      key: 'hist_luther',
      year: 'AD 1517',
      name: 'Martin Luther',
      subtitle: 'The Reformation',
      desc: 'A German monk nailed 95 theses to a church door in Wittenberg — a protest against corruption that ignited a revolution. Luther insisted salvation came by grace alone, through faith alone, according to Scripture alone. His courage fractured the medieval church and gave birth to Protestantism.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    },
    {
      key: 'hist_bible',
      year: 'AD 1455',
      name: 'The Gutenberg Bible',
      subtitle: 'Scripture for Everyone',
      desc: 'Johann Gutenberg\'s printing press made the Bible the first mass-produced book in Europe. Within decades, Scripture spread to households, not just monasteries. Ordinary people could read God\'s word for themselves — a democratization of faith that fueled both the Reformation and modern literacy.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    },
    {
      key: 'hist_missions',
      year: '1700s–1900s',
      name: 'The Great Missions Era',
      subtitle: 'A Gospel to All Nations',
      desc: 'Figures like William Carey, Hudson Taylor, and David Livingstone carried the gospel to India, China, and Africa at enormous personal cost. Imperfect and sometimes entangled with empire, the missionary movement also established schools, hospitals, and translated Scripture into thousands of languages.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    },
    {
      key: 'hist_global',
      year: 'Today',
      name: 'A Global Church',
      subtitle: '2.4 Billion & Growing',
      desc: 'Christianity is now the world\'s largest religion — and growing fastest in the Global South. Africa, Asia, and Latin America are its new heartlands. In 2,000 years, the faith of twelve fishermen and a carpenter from Galilee has reached every nation, tongue, and tribe on earth.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    },
  ];

  return (
    <section className="py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-accent mb-3">2,000 Years</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-6">A Tapestry of History</h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            People began compiling stories of their search for a one true God — and in that search, they <span className="text-foreground font-medium">honestly tracked good and evil across millennia, often in the same person</span>. Unlike the god-kings of old who could do no wrong, this became the greatest, longest, and most candid exploration of morality ever recorded — across kings and subjects, wealthy and poor. Until one day, the person everything pointed to arrived: Jesus Christ, unremarkable in every outward way, claiming to be God come to meet and save us.
            <br /><br />
            A figure so singular in moral clarity, impact, death, and resurrection that <span className="text-foreground font-medium">history itself was cleaved in two</span> — Before Christ and After. Completely ordinary individuals died spreading this extraordinary story, conquering empires with the word, not the sword. And though the movement was sometimes seized for evil ends by popes, conquistadors, and kings — the truth was so potent that even buried embers reignited into reformations, transforming civilization itself again and again.
            <br /><br />
            <span className="text-foreground font-medium italic">We invite you to join us — and write your name in the next chapter of the greatest epic of all time.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cards.map((card, i) => {
            const isOpen = expanded === card.key;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`group relative bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-xl ${isOpen ? 'ring-2 ring-accent/40' : ''}`}
                onClick={() => setExpanded(isOpen ? null : card.key)}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden group/editimg" onClick={e => isAdmin && e.stopPropagation()}>
                  <EditableImage
                    imageKey={card.key}
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    isAdmin={isAdmin}
                    wrapperClassName="relative w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                  {/* Year badge */}
                  <span className="absolute top-3 left-3 font-body text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {card.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading text-lg text-primary leading-tight mb-0.5">{card.name}</h3>
                  <p className="font-body text-xs text-accent font-medium mb-3">{card.subtitle}</p>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.p
                        key="desc"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="font-body text-sm text-muted-foreground leading-relaxed overflow-hidden"
                      >
                        {card.desc}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2"
                      >
                        {card.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 flex items-center gap-1 text-accent text-xs font-body">
                    <span>{isOpen ? 'Show less' : 'Read more'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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
      <KeyValuesSection />
      <DenominationsSection />
      <CultSection />
      <HistorySection isAdmin={isAdmin} />
      <ClosingSection />
    </div>
  );
}