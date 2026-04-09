import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedStat = ({ end, decimals = 0 }: { end: number, decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useCountUp(end, 2, ref);
  return <span ref={ref} className="font-serif">{count.toFixed(decimals)}</span>;
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-[#F6FFF8]"
    >


      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-16 lg:gap-20 items-center">

          {/* ── LEFT COLUMN ── */}
          <motion.div style={{ y: textY, opacity }} className="relative z-20">


            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-bold text-[#1B2D24] leading-[1.05] tracking-tight mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              Authentic food,<br />
              <span className="text-[#1B4332] italic">curated for scale.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#4A6357] leading-relaxed max-w-xl mb-12 font-sans"
            >
              Beyond delivery. We bridge the gap between artisanal home chefs and sophisticated palates, bringing India's culinary heritage to your corporate events and daily life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link to="/catalog">
                <Button
                  size="lg"
                  className="h-16 px-10 text-base font-bold gap-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore The Catalog <ArrowRight strokeWidth={3} size={20} />
                </Button>
              </Link>
              
              <Link to="/mealbox-builder">
                <button className="flex items-center gap-3 text-[#1B2D24] font-bold text-sm tracking-widest uppercase group">
                  <div className="w-12 h-12 rounded-full border-2 border-[#D4E8DA] flex items-center justify-center group-hover:border-[#1B4332] group-hover:bg-[#1B4332]/5 transition-all duration-300">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  The Build
                </button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-20 flex flex-wrap items-center gap-10 md:gap-16 pt-10 border-t border-[#D4E8DA] max-w-2xl"
            >
              <div>
                <span className="block text-3xl md:text-4xl font-serif font-bold text-[#1B2D24]"><AnimatedStat end={120} />+</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mt-1 block">Artisans</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-serif font-bold text-[#1B2D24]"><AnimatedStat end={50} />k</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mt-1 block">Delivered</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-serif font-bold text-[#1B2D24]">4.<AnimatedStat end={9} /></span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mt-1 block">Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Parallax Image Layer ── */}
          <motion.div
            className="relative hidden lg:block h-[700px] w-full"
            style={{ y: imageY, scale }}
          >
            {/* Main Visual Window */}
            <div className="absolute inset-0 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(27,67,50,0.15)] ring-1 ring-[#1B4332]/10 bg-[#EEF8F1]">
              <img 
                src="/assets/images/hero-food.jpg" 
                alt="Editorial Food Visual" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                onError={(e) => { 
                  // Fallback to high-quality placeholder if user hasn't uploaded yet
                  e.currentTarget.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"; 
                }}
              />
              
              {/* Glass overlay badge */}
              <div className="absolute bottom-10 left-10 right-10 p-8 glass-card rounded-[2.5rem] border-white/20">
                <div className="flex items-center gap-2 mb-2">
                   {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#1B4332] text-[#1B4332]" />)}
                </div>
                <p className="text-xl font-serif font-bold text-[#1B2D24] leading-tight mb-2">
                  "The most authentic Hyderabadi Zafran I've ever tasted outside of a home."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-[#1B4332]/30" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#7A9A88]">Siddharth R., Product Lead</span>
                </div>
              </div>
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
