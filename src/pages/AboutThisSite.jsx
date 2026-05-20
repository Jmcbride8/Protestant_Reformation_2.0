import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, Image, HeartHandshake, MapPin, Clock, MessageCircle } from "lucide-react";

const featureExplanations = [
  {
    category: "About",
    icon: BookOpen,
    title: "The Christian Faith",
    reason: "Most churches assume visitors know. In a post-Christian society, we don't take that for granted — and provide a primer.",
  },
  {
    category: "About",
    icon: Users,
    title: "Membership",
    reason: "Many churches do not create an opportunity to escalate commitment. Church becomes a club rather than a family.",
  },
  {
    category: "Programming",
    icon: Calendar,
    title: "Milestones",
    reason: "Life happens in discrete events, stages, and changes. Catalysts. We want to have a place for people when a life event catalyzes their search.",
  },
  {
    category: "People",
    icon: Image,
    title: "Memories",
    reason: "We always have pictures of loved ones and children on our walls. Church is a family. Memories matter. We just gave them a home.",
  },
  {
    category: "Serve & Give",
    icon: HeartHandshake,
    title: "Give",
    reason: "A unique set of giving opportunities to enable peer-to-peer, community giving, and the typical church giving.",
  },
  {
    category: "Programming",
    icon: MapPin,
    title: "Programs",
    reason: "Faith isn't just Sunday morning. It's lived out through service, care, and community engagement throughout the week.",
  },
  {
    category: "Programming",
    icon: Clock,
    title: "Schedule",
    reason: "Rhythm matters. We make it clear when we gather so people can build their lives around community, not the other way around.",
  },
  {
    category: "People",
    icon: MessageCircle,
    title: "Care & Support",
    reason: "Life is hard. We believe the church should be the first place people turn when they need help — and the last place they're turned away.",
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