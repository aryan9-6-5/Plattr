import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, User, PartyPopper, ArrowRight } from "lucide-react";

const audiences = [
  {
    key: "individual",
    icon: User,
    title: "For Individuals",
    tagline: "Daily meals & tiffin service",
    to: "/catalog",
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
    to: "/for-business",
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
    to: "/for-business",
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
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Who It's For
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            One platform, every scale
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-6 overflow-visible px-4">
            {audiences.map((aud, idx) => {
              const isActive = activeIndex === idx;
              const Icon = aud.icon;

              return (
                <motion.div
                  key={aud.key}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.4,
                    x: (idx - activeIndex) * 20,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 w-full max-w-md cursor-pointer
                             bg-[#F6FFF8] rounded-[40px] p-8 md:p-12 border-2 
                             transition-colors duration-500
                             ${isActive ? "border-[#2D6A4F] shadow-2xl" : "border-transparent"}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8
                                   ${isActive ? "bg-[#2D6A4F] text-white" : "bg-[#D8F3DC] text-[#2D6A4F]"}`}>
                    <Icon size={32} />
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-[#1B2D24] mb-3">{aud.title}</h3>
                  <p className="text-[#4A6357] text-lg mb-8 font-medium italic">{aud.tagline}</p>
                  
                  <ul className="space-y-4 mb-10">
                    {aud.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-[#4A6357]">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#52B788] flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <Link to={aud.to}>
                    <button className={`flex items-center gap-2 font-bold text-sm tracking-wide uppercase
                                        transition-colors ${isActive ? "text-[#2D6A4F]" : "text-[#7A9A88]"}`}>
                      {aud.cta} <ArrowRight size={18} />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {audiences.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 
                           ${activeIndex === idx ? "w-8 bg-[#2D6A4F]" : "w-2 bg-[#D4E8DA]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
