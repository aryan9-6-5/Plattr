import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useServicePipelines } from "@/hooks/useServiceInfrastructure";

const ServicesSection = () => {
  const { pipelines, loading, error } = useServicePipelines();

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center bg-[#F6FFF8] border-y border-[#D4E8DA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B4332]" />
      </div>
    );
  }

  if (error || pipelines.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#F6FFF8] border-y border-[#D4E8DA]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] mb-16 md:mb-24 text-center md:text-left">
          Our Service Pipelines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-11">
          {pipelines.map((svc, idx) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                to={svc.href}
                className={`relative block h-[400px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group ${svc.bg_class === 'bg-white' ? 'bg-[#FFFFFF]' : 'bg-[#EEF8F1]'}`}
              >
                {/* Background Image Container - Window Scale Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="w-full h-full transform-gpu"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {svc.is_full_bleed ? (
                      <img 
                        src={svc.img_src} 
                        alt={svc.title} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <img 
                        src={svc.img_src} 
                        alt={svc.title} 
                        className="absolute bottom-0 right-0 w-4/5 max-h-[85%] object-contain origin-bottom-right p-6"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Subtle editorial gradient overlay */}
                  {svc.is_full_bleed && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F6FFF8]/95 via-[#F6FFF8]/30 to-transparent" />
                  )}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 px-8 py-10 md:px-10 md:py-12 flex flex-col h-full pointer-events-none">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1B2D24] mb-2 leading-tight">
                      {svc.title}
                    </h3>

                  </div>
                  
                  <div className="mt-auto">
                    <div className="w-14 h-14 bg-[#1B4332] rounded-full flex items-center justify-center text-white shadow-xl group-hover:bg-[#2D6A4F] group-hover:translate-x-3 transition-all duration-500 pointer-events-auto">
                      <ChevronRight className="w-7 h-7" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
