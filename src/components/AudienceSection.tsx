import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, User, Building2, PartyPopper } from "lucide-react";

const audiences = [
  {
    key: "individual",
    title: "Individuals",
    tagline: "Daily meals & tiffin service",
    to: "/catalog",
    icon: User,
    lines: [
      "Verified home chefs across your city.",
      "Menus that evolve weekly, not repeat.",
      "Regional depth — not generic meals.",
    ],
    cta: "Browse Tiffins",
    accent: "#52B788",
    stat: "2,400+",
    statLabel: "Active subscribers",
  },
  {
    key: "corporate",
    title: "Corporates",
    tagline: "Bulk meals & subscriptions",
    to: "/for-business",
    icon: Building2,
    lines: [
      "Recurring plans for 50–5,000+ employees.",
      "Dashboard for tracking and scheduling.",
      "Customizable menus per dietary needs.",
    ],
    cta: "Get Corporate Plan",
    accent: "#1B4332",
    stat: "180+",
    statLabel: "Enterprise clients",
    isCenter: true,
  },
  {
    key: "events",
    title: "Events",
    tagline: "Large-scale catering",
    to: "/for-business",
    icon: PartyPopper,
    lines: [
      "Weddings, conferences, community events.",
      "Multi-cuisine with professional setup.",
      "End-to-end logistics & on-site coordination.",
    ],
    cta: "Plan Your Event",
    accent: "#2D6A4F",
    stat: "500+",
    statLabel: "Events delivered",
  },
];

const AudienceSection = () => {
  const [activeKey, setActiveKey] = useState<string>("corporate");

  return (
    <section className="py-24 md:py-36 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h2 className="text-[44px] md:text-7xl lg:text-8xl font-serif font-bold text-[#1B2D24] leading-[0.95] tracking-tight">
              One engine,<br />
              <span className="italic text-[#2D6A4F]">every scale.</span>
            </h2>
          </motion.div>

          {/* Tab selector — desktop */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-plattr-subtle border border-plattr-border"
          >
            {audiences.map((aud) => (
              <button
                key={aud.key}
                onClick={() => setActiveKey(aud.key)}
                className={`
                  px-5 py-2.5 rounded-full text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-300
                  ${activeKey === aud.key
                    ? "bg-plattr-primary text-white shadow-plattr"
                    : "text-plattr-text-sec hover:text-plattr-text"
                  }
                `}
              >
                {aud.title}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── MOBILE: Dynamic Priority-Shift Tabs ── */}
        <div className="md:hidden flex flex-col items-center gap-4 mb-14 px-2">
          {/* Exploration Row */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <AnimatePresence mode="popLayout">
              {audiences
                .filter((aud) => aud.key !== activeKey)
                .map((aud) => (
                  <motion.button
                    key={aud.key}
                    layoutId={`tab-${aud.key}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    onClick={() => setActiveKey(aud.key)}
                    className="bg-plattr-subtle text-plattr-text-sec border border-plattr-border px-4 py-3.5 rounded-2xl text-[11px] font-bold tracking-[0.1em] uppercase shadow-plattr active:scale-95 flex items-center justify-center"
                  >
                    {aud.title}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>

          {/* Context Row */}
          <div className="w-full flex justify-center">
            <AnimatePresence mode="popLayout">
              {audiences
                .filter((aud) => aud.key === activeKey)
                .map((aud) => (
                  <motion.button
                    key={aud.key}
                    layoutId={`tab-${aud.key}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="bg-plattr-primary text-white shadow-plattr-elevated px-8 py-4 rounded-2xl text-[13px] font-black tracking-[0.18em] uppercase w-full flex items-center justify-center gap-3"
                  >
                    <motion.div 
                      layoutId="active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-plattr-tint" 
                    />
                    {aud.title}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── CONTENT — All 3 cards visible on desktop, active card on mobile ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {audiences.map((aud, idx) => {
            const isActive = activeKey === aud.key;
            const AudIcon = aud.icon;

            return (
              <motion.div
                key={aud.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setActiveKey(aud.key)}
                className={`
                  group relative rounded-2xl p-8 cursor-pointer h-full
                  transition-all duration-500 border flex flex-col
                  ${isActive
                    ? "bg-plattr-primary border-plattr-primary shadow-plattr-elevated md:-translate-y-4"
                    : "bg-white border-plattr-border shadow-plattr hover:border-plattr-text hover:-translate-y-2 hover:shadow-plattr-elevated"
                  }
                  ${!isActive ? "hidden md:flex" : "flex"}
                `}
              >

                {/* Icon + Tag */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500
                    ${isActive ? "bg-white/15" : "bg-plattr-subtle"}
                  `}>
                    <AudIcon size={22} strokeWidth={1.5} className={isActive ? "text-white" : "text-plattr-secondary"} />
                  </div>
                  <span className={`
                    text-[10px] font-black tracking-[0.2em] uppercase
                    ${isActive ? "text-[#52B788]" : "text-[#7A9A88]"}
                  `}>
                    {aud.tagline}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`
                  font-serif font-bold tracking-tight mb-2 transition-colors duration-500
                  ${aud.isCenter ? "text-[32px] md:text-[36px]" : "text-[28px] md:text-[32px]"}
                  ${isActive ? "text-white" : "text-[#1B2D24]"}
                `}>
                  {aud.title}
                </h3>

                <div className={`
                  flex items-baseline gap-2 mb-6 pb-6 border-b transition-colors duration-500
                  ${isActive ? "border-white/20" : "border-plattr-subtle"}
                `}>
                  <span className={`text-[28px] font-serif font-bold ${isActive ? "text-plattr-tint" : "text-plattr-secondary"}`}>
                    {aud.stat}
                  </span>
                  <span className={`text-[12px] font-medium ${isActive ? "text-white/60" : "text-[#7A9A88]"}`}>
                    {aud.statLabel}
                  </span>
                </div>

                {/* Prose lines */}
                <div className="space-y-3 mb-8">
                  {aud.lines.map((line) => (
                    <p key={line} className={`
                      text-[14px] leading-relaxed font-sans transition-colors duration-500
                      ${isActive ? "text-white/80" : "text-[#4A6357]"}
                    `}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <Link to={aud.to} onClick={(e) => e.stopPropagation()}>
                  <span className={`
                    inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase 
                    transition-all duration-500 group-hover:gap-4
                    ${isActive ? "text-plattr-tint" : "text-plattr-primary"}
                  `}>
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
