import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Building2, ShieldCheck, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedStat = ({ end, decimals = 0 }: { end: number, decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useCountUp(end, 2, ref);
  return <span ref={ref}>{count.toFixed(decimals)}</span>;
};

const pipelinePills = [
  { icon: ChefHat,    label: "Home Chef" },
  { icon: Building2,  label: "Kitchen" },
  { icon: ShieldCheck,label: "Quality" },
  { icon: Truck,      label: "Delivery" },
  { icon: User,       label: "You" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const leftY       = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const rightScale  = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const rightY      = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-mesh)" }} />

      {/* Blurred orbs */}
      <div
        className="absolute top-[-5%] right-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(82,183,136,0.12)", filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(45,106,79,0.08)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <motion.div style={{ y: leftY, opacity: leftOpacity }}>



            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="font-serif font-bold text-[#1B2D24] leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Food that flows{" "}
              <span className="italic text-[#2D6A4F]">from source to you</span>
            </motion.h1>

            {/* Pipeline mini-display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 flex-wrap mt-5 mb-6"
            >
              {pipelinePills.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-[#D4E8DA] text-xs font-medium text-[#4A6357]"
                >
                  <pill.icon className="w-3 h-3 text-[#2D6A4F]" />
                  {pill.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Body paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-lg text-[#4A6357] leading-relaxed max-w-lg mb-10"
            >
              Plattr isn't another food app. It's a structured pipeline that connects
              authentic home chefs to your plate — with quality control, scale, and
              transparency built into every step.
            </motion.p>

            {/* Button group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/catalog">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-sm font-semibold gap-2 bg-[#2D6A4F] hover:bg-[#1e4d38] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Order Food <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/for-business">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-sm font-semibold rounded-full border-[#D4E8DA] text-[#2D6A4F] hover:bg-[#D8F3DC] hover:border-[#52B788] transition-all duration-200"
                  >
                    Partner With Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 flex flex-wrap items-center justify-between sm:justify-start gap-6 sm:gap-12 pt-8 border-t border-[#D4E8DA] max-w-lg"
            >
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#1B2D24]"><AnimatedStat end={120} />+</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#52B788]">Verified Chefs</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-[#D4E8DA] hidden sm:block"></div>
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#1B2D24]"><AnimatedStat end={50} />k+</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#52B788]">Meals Delivered</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-[#D4E8DA] hidden sm:block"></div>
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#1B2D24]">4.<AnimatedStat end={9} /></span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#52B788]">User Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Floating Card Stack ── */}
          <motion.div
            style={{ scale: rightScale, y: rightY }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm mx-auto" style={{ height: "380px" }}>

              {/* Card layer 1 — back */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg"
                style={{ transform: "rotate(-6deg) scale(0.95)" }}
              />

              {/* Card layer 2 — mid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl border border-white/70 shadow-lg"
                style={{ transform: "rotate(-2deg) scale(0.97)" }}
              />

              {/* Card layer 3 — front (main) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl p-6 h-full flex flex-col"
              >
                {/* Food image placeholder */}
                <div className="w-full aspect-video rounded-2xl bg-[#EEF8F1] mb-4 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <span className="text-4xl">🍛</span>
                </div>

                {/* Dish info */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-0.5">Telugu Cuisine</p>
                    <h3 className="font-semibold text-[#1B2D24] text-base">Hyderabadi Dum Biryani</h3>
                    <p className="text-sm text-[#4A6357] mt-0.5">By Anita Reddy · Hyderabad</p>
                  </div>
                  <span className="font-bold text-[#2D6A4F] text-lg mt-1">₹250</span>
                </div>

                {/* Source badge */}
                <div className="mt-auto pt-3 border-t border-[#E8F5EC] flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-white">
                    <ChefHat className="w-3 h-3" />
                    Home Chef
                  </span>
                  <span className="text-xs text-[#7A9A88]">Verified · FSSAI</span>
                </div>
              </motion.div>

              {/* Floating badge 1 — chef */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="absolute -left-10 top-8 bg-white rounded-2xl shadow-md px-4 py-2.5 text-xs font-semibold text-[#1B2D24] border border-[#D4E8DA] flex items-center gap-2 animate-float"
              >
                👩‍🍳 Anita Reddy · Hyderabad
              </motion.div>

              {/* Floating badge 2 — kitchen */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="absolute -right-8 bottom-8 bg-white rounded-2xl shadow-md px-4 py-2.5 text-xs font-semibold text-[#1B2D24] border border-[#D4E8DA] flex items-center gap-2 animate-float-slow"
              >
                🏭 Cloud Kitchen · 30min
              </motion.div>

              {/* Floating badge 3 — rating */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.7 }}
                className="absolute -right-4 top-4 bg-[#2D6A4F] rounded-2xl shadow-md px-3 py-2 text-xs font-semibold text-white animate-float-slower"
              >
                ⭐ 4.9 · 200+ Orders
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="text-center mt-16 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex flex-col items-center gap-1 text-[#7A9A88]"
          >
            <span className="text-xs font-medium">See how the system works</span>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
