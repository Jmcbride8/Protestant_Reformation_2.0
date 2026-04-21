import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  HeartHandshake, Baby, Briefcase, BookOpen, HandHeart, Cross, 
  Heart, UtensilsCrossed, Clock, MapPin, ArrowRight, GraduationCap, Home
} from 'lucide-react';

const lifeServices = [
  {
    icon: HeartHandshake,
    title: "Marriage Counseling",
    description: "Whether you're preparing for marriage, working through challenges, or wanting to grow stronger together — our pastors and trained counselors are here for you. Confidential, compassionate, and completely free.",
    cta: "Request Counseling"
  },
  {
    icon: Baby,
    title: "Parenting Support",
    description: "From newborns to teenagers, parenting is the hardest and most rewarding work. Join our parenting groups, attend workshops, or schedule one-on-one time with a family minister.",
    cta: "Get Support"
  },
  {
    icon: Briefcase,
    title: "Career & Life Guidance",
    description: "Navigating career transitions, searching for purpose, or need practical help with resumes and interviews? Our career ministry connects you with mentors and resources.",
    cta: "Connect With Us"
  },
  {
    icon: BookOpen,
    title: "Grief & Loss Support",
    description: "Loss is one of life's heaviest burdens. Our grief support groups and pastoral care provide a safe space to process, heal, and find comfort in community.",
    cta: "Find Comfort"
  },
  {
    icon: HandHeart,
    title: "Prayer Ministry",
    description: "Whatever you're facing, you don't have to face it alone. Submit a prayer request and our prayer team will lift you up — anonymously if you prefer.",
    cta: "Request Prayer"
  },
  {
    icon: Cross,
    title: "Baptism & Membership",
    description: "Ready to take the next step in your faith journey? We'd love to walk with you through baptism, membership, and becoming part of the Hope Church family.",
    cta: "Learn More"
  }
];

const communityGroups = [
  {
    icon: GraduationCap,
    audience: "UCSB Students",
    tag: "College Ministry",
    title: "You Belong Here — Even If You Just Moved",
    description: "Far from home, juggling classes, and searching for something real? Our college ministry is a judgment-free space built specifically for UCSB students. We gather Friday nights for dinner, honest conversation, and faith that doesn't require you to have it together.",
    bullets: [
      "Free Friday night dinners — no cost, no strings",
      "Small groups by major and interest",
      "Mentorship with local professionals & alumni",
      "Rides to Sunday service from campus",
    ],
    cta: "Connect With Us",
    accentClass: "bg-accent/10 border-accent/20",
    badgeClass: "bg-accent/15 text-accent",
  },
  {
    icon: Home,
    audience: "Young Families",
    tag: "Family Ministry",
    title: "Raising Kids Is Hard. We're In This Together.",
    description: "Whether your kids are in diapers or dodgeball, our young family community was built for parents who want to raise their children in faith without doing it alone. From playdates to parenting workshops, there's a place for your whole family here.",
    bullets: [
      "Sunday kids' program (birth through 5th grade)",
      "Monthly family dinners & playdates",
      "Parenting workshops led by local counselors",
      "Babysitting co-op for date nights",
    ],
    cta: "Meet the Family",
    accentClass: "bg-secondary border-border/50",
    badgeClass: "bg-primary/10 text-primary",
  },
];

const weeklySchedule = [
  { day: "Sunday", time: "9:00 & 11:00 AM", event: "Worship Services", icon: Cross },
  { day: "Wednesday", time: "6:00 PM", event: "Community Dinner (at cost)", icon: UtensilsCrossed },
  { day: "Wednesday", time: "7:00 PM", event: "Midweek Study & Prayer", icon: BookOpen },
  { day: "Saturday", time: "8:00 AM", event: "Men's & Women's Groups", icon: HeartHandshake },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">Life Services</p>
            <h1 className="font-heading text-5xl sm:text-6xl text-primary mb-6">
              We're Here for <span className="italic">Every Season</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              In a digital world, finding real support can feel impossible. Hope Church is a place 
              where real people offer real help — for free, for everyone. You don't need to be a member.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Life Services Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifeServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group p-8 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-card"
                >
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-heading text-2xl text-primary mb-3">{service.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6 text-sm">
                    {service.description}
                  </p>
                  <Link to="/contact">
                    <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80">
                      {service.cta} <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Groups — College & Young Families */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">You're Not Alone</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">Made for Your Season</h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Some chapters of life need a community that truly gets it. 
              We've built two ministries designed exactly for where you are right now.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {communityGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className={`rounded-2xl border p-8 ${group.accentClass}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className={`font-body text-xs tracking-wide px-3 py-1 rounded-full font-medium ${group.badgeClass}`}>
                      {group.tag}
                    </span>
                  </div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{group.audience}</p>
                  <h3 className="font-heading text-2xl text-primary mb-3 leading-snug">{group.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">{group.description}</p>
                  <ul className="space-y-2 mb-6">
                    {group.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <span className="text-accent mt-0.5">✦</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button variant="ghost" className="font-body text-sm p-0 h-auto text-accent hover:text-accent/80">
                      {group.cta} <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary-foreground/60 mb-3">Join Us</p>
            <h2 className="font-heading text-4xl sm:text-5xl mb-4">Weekly Schedule</h2>
          </div>
          <div className="space-y-4">
            {weeklySchedule.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-lg">{item.event}</h4>
                    <p className="font-body text-sm text-primary-foreground/60">{item.day}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span className="font-body text-sm">{item.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12 flex items-center justify-center gap-2 text-primary-foreground/60">
            <MapPin className="w-4 h-4" />
            <span className="font-body text-sm">123 Hope Street, Santa Barbara, CA 93101</span>
          </div>
        </div>
      </section>

      {/* Weddings */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
              Weddings at Hope Church
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
              Our beautiful 1950s sanctuary — lovingly renovated with warm farmhouse charm — 
              is available for weddings <strong>at cost</strong> to everyone in the Santa Barbara community, 
              regardless of membership.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              We believe every couple deserves a beautiful place to begin their journey. 
              No markup, no pressure — just a sacred space for your special day.
            </p>
            <Link to="/contact">
              <Button size="lg" className="font-body tracking-wide bg-primary hover:bg-primary/90">
                Inquire About Weddings
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}