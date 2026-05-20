import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, Image, HeartHandshake, MapPin, Clock, MessageCircle } from "lucide-react";

const featureExplanations = [
  {
    category: "About",
    icon: BookOpen,
    title: "The Christian Faith",
    reason: "Most churches assume visitors know. In a post-Christian society, we don't take that for granted — and provide a primer. Unlike standard church sites that focus on events and sermons, we offer a dedicated space explaining Christianity itself: what we believe, why it matters, and how it differs from other worldviews. This isn't typical church marketing — it's discipleship before membership.",
  },
  {
    category: "About",
    icon: Users,
    title: "Membership",
    reason: "Many churches do not create an opportunity to escalate commitment. Church becomes a club rather than a family. Standard sites have a 'Contact Us' form. We have a membership pathway — a clear, intentional process for moving from visitor to member. This feature creates accountability and belonging, not just attendance.",
  },
  {
    category: "Programming",
    icon: Calendar,
    title: "Milestones",
    reason: "Life happens in discrete events, stages, and changes. Catalysts. We want to have a place for people when a life event catalyzes their search. Most church websites are static — they don't meet people in their moments of need. Milestones creates landing pages for baptism, marriage, grief, career transitions — life events that make people spiritually receptive. Standard sites list programs. We meet people where they are.",
  },
  {
    category: "People",
    icon: Image,
    title: "Memories",
    reason: "We always have pictures of loved ones and children on our walls. Church is a family. Memories matter. We just gave them a home. No standard church website has a photo archive of members' life moments — graduations, baptisms, mission trips. This feature treats the church like a family album, not a bulletin board. It's relational infrastructure, not marketing.",
  },
  {
    category: "Serve & Give",
    icon: HeartHandshake,
    title: "Give",
    reason: "A unique set of giving opportunities to enable peer-to-peer, community giving, and the typical church giving. Standard church sites have one giving button — usually for the general fund. We enable three layers: church-wide giving (annual budget), capital campaigns (building projects), and peer-to-peer giving (help a family in need, support a small group). This is mutual aid, not just donations.",
  },
  {
    category: "Programming",
    icon: MapPin,
    title: "Programs",
    reason: "Faith isn't just Sunday morning. It's lived out through service, care, and community engagement throughout the week. Most sites list ministries. We coordinate them — volunteer signups, carpooling, event RSVPs, small group matching. This is operational infrastructure that turns programs into participation.",
  },
  {
    category: "Programming",
    icon: Clock,
    title: "Schedule",
    reason: "Rhythm matters. We make it clear when we gather so people can build their lives around community, not the other way around. Standard sites have an events calendar. We have a living calendar with RSVP tracking, recurring event management, and integration with member schedules. It's not just information — it's coordination.",
  },
  {
    category: "People",
    icon: MessageCircle,
    title: "Care & Support",
    reason: "Life is hard. We believe the church should be the first place people turn when they need help — and the last place they're turned away. Most church sites have a prayer request form that goes into a black hole. We have a full care ecosystem: anonymous support requests, rideshare coordination, meal trains, small group-based mutual aid. This is what 'bear one another's burdens' looks like in 2024.",
  },
];

export default function AboutThisSite() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Design Philosophy</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-primary mb-4">About This Site</h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature exists for a reason. Here's the thinking behind what we built and why.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6">
          {featureExplanations.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-body text-xs tracking-[0.2em] uppercase text-accent">{feature.category}</span>
                    </div>
                    <h3 className="font-heading text-xl text-primary mb-2">{feature.title}</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">{feature.reason}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="font-body text-sm text-muted-foreground italic">
            This platform was built to help churches grow deep, not just wide.
          </p>
        </motion.div>
      </div>
    </div>
  );
}