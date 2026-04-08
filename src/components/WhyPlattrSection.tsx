import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Clock, ThumbsUp, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Every dish is prepared using fresh, locally-sourced ingredients on the day of delivery.",
  },
  {
    icon: Clock,
    title: "Always on Time",
    desc: "Our delivery network is optimized for exact slot timings. Daily tiffin or 500-person event.",
  },
  {
    icon: ThumbsUp,
    title: "FSSAI Verified",
    desc: "100% of our network partners are audited for hygiene and hold active FSSAI credentials.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    desc: "No hidden fees, no surge pricing. Bulk orders qualify for automatic volume discounts.",
  },
];

const WhyPlattrSection = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      setScrollWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="bg-white py-24 md:py-32 border-t border-[#D4E8DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#52B788] mb-4 block">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1B2D24] leading-[1.1] tracking-tight">
            Built for reliability
          </h2>
          <p className="text-[#4A6357] max-w-xl mx-auto mt-6 text-lg font-medium">
            We handle the complexity so you can focus on eating. Quality, hygiene, and timely delivery guaranteed.
          </p>
        </RevealOnScroll>

        <motion.div 
          ref={carouselRef}
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -scrollWidth }}
            className="flex gap-6 pb-12"
          >
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                className="min-w-[300px] md:min-w-[350px] bg-[#F6FFF8] rounded-[32px] p-10 border border-[#D4E8DA] shadow-sm transform transition-all duration-300 hover:shadow-xl relative overflow-hidden group select-none"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D8F3DC] rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 origin-center opacity-40" />
                
                <div className="w-16 h-16 bg-[#2D6A4F] text-white rounded-[20px] flex items-center justify-center mb-10 shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <feat.icon size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-[#1B2D24] mb-4 relative z-10">{feat.title}</h3>
                <p className="text-base text-[#4A6357] leading-relaxed relative z-10 font-medium">
                  {feat.desc}
                </p>

                <div className="mt-8 flex items-center gap-2 text-[#2D6A4F] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Read More <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 text-[#7A9A88] text-[10px] font-bold uppercase tracking-widest mt-4">
          <ChevronLeft size={16} className="animate-pulse" /> Drag to explore <ChevronRight size={16} className="animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default WhyPlattrSection;
