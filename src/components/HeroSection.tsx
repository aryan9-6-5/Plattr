import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, PlayCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedStat = ({ end, decimals = 0 }: { end: number; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useCountUp(end, 2, ref);
  return <span ref={ref}>{count.toFixed(decimals)}</span>;
};

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FDFCF9]"
      style={{ height: "100svh", maxHeight: "100svh" }}
    >

      {/* ── BACKGROUND IMAGE (LCP Optimized) ── */}
      <img
        src="/images/hero.png"
        alt=""
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "65% center" }}
      />

      {/* ── DESKTOP OVERLAY - Radial cinematic fade from left ── */}
      <div
        className="hidden md:block absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(
              ellipse 85% 160% at 0% 50%,
              rgba(253,252,249,0.97) 0%,
              rgba(253,252,249,0.92) 25%,
              rgba(253,252,249,0.65) 45%,
              rgba(253,252,249,0.25) 60%,
              rgba(253,252,249,0.00) 75%
            )
          `,
        }}
      />

      {/* ── MOBILE OVERLAY - Radial veil from top-left (traces the food naturally) ── */}
      <div
        className="md:hidden absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(
              ellipse 140% 130% at 5% 5%,
              rgba(253,252,249,0.97) 0%,
              rgba(253,252,249,0.92) 22%,
              rgba(253,252,249,0.70) 42%,
              rgba(253,252,249,0.35) 58%,
              rgba(253,252,249,0.00) 75%
            )
          `,
        }}
      />

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex relative z-20 h-full flex-col justify-center pl-16 lg:pl-24 pr-10 pt-8 pb-8">
        <div style={{ maxWidth: "560px" }} className="flex flex-col gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-bold text-[#1B2D24] leading-[1.02] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 4.2vw, 4.2rem)" }}
          >
            Authentic food,<br />
            <span className="text-[#2D6A4F] italic">curated for scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#3A433E] leading-relaxed font-sans font-medium"
            style={{ fontSize: "clamp(0.85rem, 1.15vw, 1.05rem)", maxWidth: "460px" }}
          >
            Beyond delivery. We bridge the gap between artisanal home chefs and sophisticated palates, bringing India's culinary heritage to your corporate events and daily life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-5"
          >
            <Link to="/catalog">
              <Button aria-label="Explore the catalog" className="h-13 px-8 text-sm font-bold gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                Explore The Catalog <ArrowRight strokeWidth={2.5} size={16} />
              </Button>
            </Link>

            <Link to="/mealbox-builder">
              <button aria-label="Start the build" className="flex items-center gap-3 text-[#1B2D24] font-bold text-xs tracking-[0.2em] uppercase group">
                <div className="w-10 h-10 rounded-full border-2 border-[#1B4332]/30 flex items-center justify-center group-hover:bg-[#1B4332] group-hover:text-white transition-all duration-300">
                  <PlayCircle className="w-4 h-4" />
                </div>
                The Build
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="rounded-3xl p-5 shadow-lg border border-white/90"
            style={{
              maxWidth: "400px",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-1 mb-2.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#1B4332] text-[#1B4332]" />
              ))}
            </div>
            <p className="text-[0.95rem] font-serif font-bold text-[#1B2D24] leading-snug mb-3">
              "The most authentic Hyderabadi Zafran I've ever tasted outside of a home."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-px bg-[#1B4332]/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]">
                Siddharth R., Product Lead
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="flex items-center gap-6 lg:gap-10 mt-4"
          >
            {[
              { value: <><AnimatedStat end={120} />+</>, label: "Artisans" },
              { value: <><AnimatedStat end={50} />k+</>, label: "Meals Delivered" },
              { value: <>4.9</>, label: "Rating" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 lg:gap-10">
                {i > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 shrink-0" />
                )}
                <div className="flex flex-col">
                  <div className="text-xl lg:text-2xl font-serif font-bold text-[#1B2D24]">
                    {stat.value}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#5A7A65] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT - Viewport-locked editorial ── */}
      <div className="md:hidden relative z-20 h-full flex flex-col pl-6 pr-6 pb-4"
        style={{ paddingTop: "calc(64px + 12px)" }}
      >

        {/* ── TOP — Headline + Paragraph ── */}
        <div className="flex flex-col gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-bold text-[#1B2D24] leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(32px, 9vw, 42px)" }}
          >
            Authentic food,<br />
            <span className="text-[#2D6A4F] italic">curated for scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[#3A433E] text-[14px] leading-[1.6] font-medium max-w-[280px]"
          >
            Beyond delivery. We bridge the gap between artisanal home chefs and sophisticated palates, bringing India's culinary heritage to your corporate events and daily life.
          </motion.p>
        </div>

        {/* ── MIDDLE — CTAs + Testimonial ── */}
        <div className="flex flex-col gap-3 mt-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Link to="/catalog">
              <Button aria-label="Explore catalog" className="w-fit h-[48px] px-7 text-[14px] font-bold gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full shadow-[0_8px_30px_rgba(27,67,50,0.5)]">
                Explore The Catalog <ArrowRight strokeWidth={2.5} size={15} />
              </Button>
            </Link>

            <Link to="/mealbox-builder" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full border-2 border-[#1B4332]/30 flex items-center justify-center group-active:scale-95 transition-transform">
                <PlayCircle className="w-4 h-4 text-[#1B4332]" />
              </div>
              <span className="text-[11px] tracking-[0.2em] font-bold uppercase text-[#1B2D24]">
                THE BUILD
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="rounded-[16px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.10)] border border-white/60 max-w-[260px]"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-3 h-3 fill-[#1B4332] text-[#1B4332]" />
              ))}
            </div>
            <p className="text-[14px] font-serif font-bold italic text-[#1B2D24] leading-[1.4] mb-2">
              "The most authentic Hyderabadi Zafran I've ever tasted outside of a home."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-px bg-[#1B4332]/40" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#1B4332]">
                  Siddharth R.,
                </span>{" "}
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#1B4332]/60">
                  Product Lead
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM — Stats Bar (viewport-anchored) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-auto rounded-[16px] px-4 h-[64px] flex items-center justify-between w-full"
          style={{ background: "rgba(27,45,36,0.92)", backdropFilter: "blur(16px)" }}
        >
          <div className="text-center flex-1">
            <div className="text-[20px] font-serif font-bold text-[#D8F3DC]">
              <AnimatedStat end={120} />+
            </div>
            <div className="text-[8px] font-bold tracking-[0.15em] text-[#7A9A88]">
              ARTISANS
            </div>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          <div className="text-center flex-1">
            <div className="text-[20px] font-serif font-bold text-[#D8F3DC]">
              <AnimatedStat end={50} />k+
            </div>
            <div className="text-[8px] font-bold tracking-[0.15em] text-[#7A9A88]">
              MEALS DELIVERED
            </div>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          <div className="text-center flex-1">
            <div className="text-[20px] font-serif font-bold text-[#D8F3DC]">4.9</div>
            <div className="text-[8px] font-bold tracking-[0.15em] text-[#7A9A88]">
              CUSTOMER RATING
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="text-white/50 md:text-[#1B4332] w-5 h-5 opacity-60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;