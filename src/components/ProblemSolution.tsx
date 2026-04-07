import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { X, Check, TrendingDown, Users, Scale, Eye } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const problems = [
  { icon: TrendingDown, title: "Inconsistent quality across vendors", text: "Every order is a gamble — no standards, no checks." },
  { icon: Users,        title: "No authentic regional options at scale", text: "Generic menus ignore India's rich culinary diversity." },
  { icon: Scale,        title: "Expensive for bulk orders", text: "Corporate and event orders face steep per-unit pricing." },
  { icon: Eye,          title: "No transparency in food source", text: "You never know who cooked your food or how." },
];

const solutions = [
  { icon: Check, title: "Verified home chefs with quality checks", text: "Every chef is vetted. Every batch is inspected before dispatch." },
  { icon: Check, title: "15+ regional cuisines, authentic recipes", text: "Curated regional menus sourced from specialist home chefs." },
  { icon: Check, title: "Cloud kitchen model reduces cost by 40%", text: "Distributed prep means better economics for bulk orders." },
  { icon: Check, title: "Full supply chain visibility: Chef → You", text: "Every meal is traceable from source to your door." },
];

const ProblemSolution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <section className="py-20 md:py-28 bg-[#1B4332] relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>

        {/* Section header */}
        <RevealOnScroll direction="up" className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">
            Why Plattr Exists
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            The problem with food today
          </h2>
          <p className="text-white/60 max-w-md mx-auto mt-4 text-base">
            And how Plattr fixes the system — not just the surface.
          </p>
        </RevealOnScroll>

        {/* Two-panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left panel — Problems */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-3xl p-8"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-red-400 mb-6">
              The Old Way
            </p>
            <div className="space-y-0">
              {problems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-start gap-4 py-5 border-b border-white/10 last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/55 leading-relaxed mt-1">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right panel — Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-3xl p-8"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-6">
              The Plattr Way
            </p>
            <div className="space-y-0">
              {solutions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-start gap-4 py-5 border-b border-white/10 last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(45,106,79,0.4)" }}>
                    <item.icon className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/65 leading-relaxed mt-1">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Transition hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-center mt-14 text-sm text-white/40"
        >
          So how does the system actually work? ↓
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSolution;
