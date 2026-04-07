import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";

type Chef = {
  id: string;
  name: string;
  region: string;
  specialty: string;
};

const ChefsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [chefs,   setChefs]   = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChefs() {
      setLoading(true);
      const { data, error } = await supabase.from("chefs").select("*");
      if (!error && data) setChefs(data);
      setLoading(false);
    }
    fetchChefs();
  }, []);

  return (
    <section id="chefs" className="py-20 md:py-28 bg-[#F6FFF8]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Meet the Chefs
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            Skilled hands behind every dish
          </h2>
          <p className="text-[#4A6357] max-w-md mx-auto mt-4 text-base">
            Verified home chefs with generations of regional cooking expertise.
          </p>
        </RevealOnScroll>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
          </div>
        ) : chefs.length === 0 ? (
          <p className="text-center text-[#7A9A88] py-16">No chefs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {chefs.map((chef, i) => (
              <Link key={chef.id} to={`/chefs/${chef.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#D4E8DA] hover:shadow-lg hover:ring-[#52B788]/40 transition-shadow duration-300 flex flex-col items-center text-center overflow-hidden h-full"
              >
                {/* Background accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#EEF8F1] to-transparent pointer-events-none" />

                {/* Avatar container */}
                <div className="relative mt-2 mb-4 z-10">
                  {/* Avatar ring */}
                  <div className="w-20 h-20 rounded-full ring-4 ring-[#D8F3DC] group-hover:ring-[#52B788] transition-all duration-300 overflow-hidden bg-[#EEF8F1] flex items-center justify-center">
                    <span className="text-3xl font-serif font-bold text-[#2D6A4F]">
                      {chef.name.charAt(0)}
                    </span>
                  </div>

                  {/* Verified badge */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2D6A4F] border-2 border-white flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* Region eyebrow */}
                <p className="text-xs font-bold tracking-widest uppercase text-[#52B788]">
                  {chef.region}
                </p>

                {/* Chef name */}
                <h4 className="text-base font-semibold text-[#1B2D24] mt-1">{chef.name}</h4>

                {/* Specialty */}
                <p className="text-sm text-[#4A6357] leading-relaxed mt-2 line-clamp-2">
                  {chef.specialty}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-[#E8F5EC] w-full">
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1B2D24]">4.8</p>
                    <p className="text-xs text-[#7A9A88]">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1B2D24]">120+</p>
                    <p className="text-xs text-[#7A9A88]">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1B2D24]">5yr</p>
                    <p className="text-xs text-[#7A9A88]">Experience</p>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChefsSection;
