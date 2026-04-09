import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";
import ChefCard from "./food/ChefCard";

type Chef = {
  id: string;
  name: string;
  region: string;
  specialty: string;
  image_url?: string;
  rating?: number;
  orders_count?: number;
  experience_years?: number;
};

const ChefsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [chefs,   setChefs]   = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChefs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("chefs")
        .select("*")
        .limit(5); // Only show top 5 on homepage curation
      
      if (!error && data) setChefs(data);
      setLoading(false);
    }
    fetchChefs();
  }, []);

  return (
    <section id="chefs" className="py-16 md:py-24 bg-[#F6FFF8]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <RevealOnScroll direction="up" className="text-left mb-0">

            <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#1B2D24] leading-[1.05] tracking-tight">
              Master hands. <br />
              <span className="italic">Heritage recipes.</span>
            </h2>
          </RevealOnScroll>
          
          <RevealOnScroll direction="up" delay={0.2} className="text-left mb-0 md:max-w-sm">
            <p className="text-lg text-[#4A6357] font-sans leading-relaxed">
              We verify every artisan through a rigorous 12-point audit. Heritage cooking meets modern safety standards.
            </p>
            <Link to="/chefs" className="inline-flex items-center gap-3 text-[#1B4332] font-black text-xs tracking-[0.2em] uppercase mt-8 hover:gap-5 transition-all duration-300">
              Meet All Artisans <ArrowRight size={18} />
            </Link>
          </RevealOnScroll>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-[#1B4332] mb-6" />
            <p className="text-[11px] font-black uppercase tracking-widest text-[#7A9A88]">Acquiring Artisan Data...</p>
          </div>
        ) : chefs.length === 0 ? (
          <p className="text-center text-[#7A9A88] py-20 text-sm font-medium">No artisans available at the moment.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {chefs.map((chef, i) => (
              <ChefCard 
                key={chef.id} 
                chef={chef} 
                index={i} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChefsSection;
