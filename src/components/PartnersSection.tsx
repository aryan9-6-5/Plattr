import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";

type Restaurant = {
  id: string;
  name: string;
  brand: string;
};

const socialProof = [
  { value: "12+", label: "Brand Partners" },
  { value: "50+", label: "Signature Dishes" },
  { value: "3",   label: "Cities" },
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
    <section id="partners" className="py-20 md:py-28 bg-[#1B4332]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Restaurant Partners
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            Trusted brands on our network
          </h2>
          <p className="text-white/60 max-w-md mx-auto mt-4 text-base">
            Signature dishes from established kitchens, available through Plattr.
          </p>
        </RevealOnScroll>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#52B788]" />
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-white/40 py-16">No partners listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {restaurants.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl min-h-[120px] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 cursor-default group"
              >
                {/* Placeholder initial */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                  <span className="text-2xl font-serif font-bold text-white/70">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <p className="text-base font-semibold text-white text-center leading-tight">
                  {partner.name}
                </p>
                {partner.brand && (
                  <p className="text-xs font-medium text-[#52B788] mt-1">{partner.brand}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Social Proof Strip */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {socialProof.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-serif font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
