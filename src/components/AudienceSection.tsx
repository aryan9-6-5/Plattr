import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const audiences = [
  {
    key: "individual",
    title: "Individuals",
    tagline: "Daily meals & tiffin service",
    to: "/catalog",
    points: [
      "Verified home chefs in your area",
      "Weekly or monthly tiffin subscriptions",
      "Hyderabadi, Punjabi, South Indian & more",
    ],
    cta: "Browse Tiffins",
    accent: "#52B788",
  },
  {
    key: "corporate",
    title: "Corporates",
    tagline: "Bulk meals & subscriptions",
    to: "/for-business",
    points: [
      "Recurring plans for 50–5,000+ employees",
      "Dashboard for tracking and scheduling",
      "Customizable menus per dietary needs",
    ],
    cta: "Get Corporate Plan",
    accent: "#1B4332",
  },
  {
    key: "events",
    title: "Events",
    tagline: "Large-scale catering",
    to: "/for-business",
    points: [
      "Weddings, conferences, community events",
      "Multi-cuisine with professional setup",
      "End-to-end logistics & on-site coordination",
    ],
    cta: "Plan Your Event",
    accent: "#2D6A4F",
  },
];

const AudienceSection = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="max-w-3xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-[#1B2D24] leading-[0.9] tracking-tighter"
          >
            One engine,<br />
            <span className="italic text-[#2D6A4F]">every scale.</span>
          </motion.h2>
        </div>

        {/* Three columns — no cards, no boxes. Just typography and lines. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {audiences.map((aud, idx) => {
            const isHovered = hoveredKey === aud.key;

            return (
              <motion.div
                key={aud.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredKey(aud.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className="group py-12 md:py-16 md:px-10 first:md:pl-0 last:md:pr-0 border-t-2 border-[#E8E8E8] md:border-t-0 md:border-l md:border-[#E8E8E8] first:md:border-l-0 first:border-t-0"
              >
                {/* Top accent line */}
                <div
                  className="hidden md:block w-12 h-[3px] mb-10 transition-all duration-700"
                  style={{
                    backgroundColor: isHovered ? aud.accent : "#D4D4D4",
                    width: isHovered ? "100%" : "48px",
                  }}
                />

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2D24] mb-3 tracking-tight transition-colors duration-500 group-hover:text-[#2D6A4F]">
                  {aud.title}
                </h3>
                <p className="text-base text-[#7A9A88] mb-10 font-medium">
                  {aud.tagline}
                </p>
                
                <ul className="space-y-4 mb-12">
                  {aud.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-[#4A6357]">
                      <span className="mt-[7px] w-1 h-1 rounded-full bg-[#1B4332] flex-shrink-0" />
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>

                <Link to={aud.to}>
                  <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.25em] uppercase text-[#1B4332] transition-all duration-500 group-hover:gap-4">
                    {aud.cta} <ArrowRight size={16} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
