import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";

type Restaurant = {
  id: string;
  name: string;
  brand: string;
};

const socialProof = [
  { value: "12+", label: "Brand Partners" },
  { value: "50+", label: "Signature Plates" },
  { value: "3",   label: "City Hubs" },
];

const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      const { data, error } = await supabase.from("restaurants").select("*");
      if (!error && data) setRestaurants(data);
      setLoading(false);
    }
    fetchPartners();
  }, []);

  return (
    <section id="partners" className="py-16 md:py-24 bg-[#1B4332] relative overflow-hidden" ref={ref}>
      {/* Subtle Editorial Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[400px] font-serif font-black flex justify-between items-center rotate-[-15deg]">
          <span>NETWORK</span>
          <span>NETWORK</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">

        {/* Section header */}
        <RevealOnScroll direction="up" className="text-center mb-24">

          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight tracking-tight">
            Trusted <span className="italic italic-font-serif text-[#D8F3DC]">Global Brands.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto mt-8 text-lg font-sans leading-relaxed">
            Authenticity at scale is only possible through verified partnerships with established culinary brands.
          </p>
        </RevealOnScroll>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-[#D8F3DC] mb-6" />
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30">Syncing Network Partners...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-white/20 py-32 font-serif text-xl italic border border-dashed border-white/10 rounded-[40px]">The collective is currently in stealth.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {restaurants.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.33, 1, 0.68, 1] }}
                className="flex flex-col items-center justify-center p-10 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-700 cursor-default group aspect-square"
              >
                {/* Brand Initial */}
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all duration-700 group-hover:rotate-12">
                  <span className="text-4xl font-serif font-bold text-[#D8F3DC]">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-xl font-serif font-bold text-white text-center leading-tight mb-2">
                  {partner.name}
                </h4>
                {partner.brand && (
                  <p className="text-[10px] font-black text-[#D8F3DC]/60 uppercase tracking-[0.2em]">{partner.brand}</p>
                )}
                
                <ArrowUpRight className="w-5 h-5 text-white/10 absolute top-8 right-8 group-hover:text-[#D8F3DC] transition-colors" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Social Proof Strip */}
        <div className="mt-24 pt-16 border-t border-white/10 grid grid-cols-3 gap-12 max-w-2xl mx-auto">
          {socialProof.map((s) => (
            <div key={s.label} className="text-center group">
              <p className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 transition-all duration-500 group-hover:scale-110">{s.value}</p>
              <p className="text-[10px] font-black text-[#D8F3DC]/40 uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
