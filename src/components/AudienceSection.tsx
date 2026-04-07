import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, User, PartyPopper, ArrowRight } from "lucide-react";

const audiences = [
  {
    key: "individual",
    icon: User,
    title: "For Individuals",
    tagline: "Daily meals & tiffin service",
    points: [
      "Choose from verified home chefs in your area",
      "Subscribe to weekly or monthly tiffin plans",
      "Regional cuisines — Hyderabadi, Punjabi, South Indian & more",
    ],
    cta: "Browse Tiffins",
  },
  {
    key: "corporate",
    icon: Building,
    title: "For Corporates",
    tagline: "Bulk meals & subscriptions",
    points: [
      "Recurring meal plans for 50–5,000+ employees",
      "Dashboard for order tracking and scheduling",
      "Customizable menus per dietary requirements",
    ],
    cta: "Get Corporate Plan",
  },
  {
    key: "events",
    icon: PartyPopper,
    title: "For Events",
    tagline: "Large-scale catering",
    points: [
      "Weddings, conferences, and community events",
      "Multi-cuisine menus with professional setup",
      "End-to-end logistics and on-site coordination",
    ],
    cta: "Plan Your Event",
  },
];

const AudienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState("individual");

  const current = audiences.find((a) => a.key === active)!;

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">
            Who It's For
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
            One platform, every scale
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {audiences.map((a) => (
            <button
              key={a.key}
              onClick={() => setActive(a.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                active === a.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              <a.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{a.title.replace("For ", "")}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto bg-card rounded-2xl p-8 md:p-10 shadow-card border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <current.icon className="w-6 h-6 text-primary" />
            <h3 className="font-serif text-2xl font-bold text-foreground">{current.title}</h3>
          </div>
          <p className="text-muted-foreground mb-6">{current.tagline}</p>
          <ul className="space-y-3 mb-8">
            {current.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Button className="gap-2">
            {current.cta} <ArrowRight size={16} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AudienceSection;
