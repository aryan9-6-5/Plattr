import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Star, ArrowRight } from "lucide-react";

interface ChefCardProps {
  chef: {
    id: string | number;
    name?: string;
    is_verified?: boolean;
    region?: string;
    city?: string;
    rating?: number | null;
    total_reviews?: number;
    specialty?: string;
    is_available?: boolean;
    years_exp?: number;
    [key: string]: unknown;
  };
  index: number;
}

const ChefCard = ({ chef, index }: ChefCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.5 }}
      className="group bg-white rounded-plattr p-6 border border-plattr-border shadow-plattr hover:shadow-plattr-elevated transition-all duration-500 h-full transform-gpu"
    >
      <Link to={`/chefs/${chef.id}`} className="flex flex-col h-full">
        {/* Chef avatar + name - Window Scale Effect */}
        <div className="flex items-start gap-5 mb-6">
          <div className="relative flex-shrink-0 overflow-hidden rounded-full ring-4 ring-plattr-subtle group-hover:ring-plattr-primary/10 transition-all duration-500">
            <motion.div 
              className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white text-3xl font-bold font-serif transform-gpu"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              {chef.name?.[0] ?? "C"}
            </motion.div>
            {chef.is_verified && (
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle className="w-6 h-6 text-[#1B4332]" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1 pt-2">
            <h3 className="text-xl font-serif font-bold text-[#1B2D24] group-hover:text-[#1B4332] transition-colors leading-tight mb-1">
              {chef.name}
            </h3>
            <p className="text-sm text-[#7A9A88] flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5" /> {chef.region}
              {chef.city && ` · ${chef.city}`}
            </p>
            
            {chef.rating != null && (
              <div className="mt-3 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-plattr-border w-fit shadow-plattr">
                <Star className="w-3 h-3 fill-plattr-primary text-plattr-primary" />
                <span className="text-[12px] font-bold text-plattr-text">{chef.rating}</span>
                <span className="text-[11px] text-plattr-text-muted">({chef.total_reviews ?? 0})</span>
              </div>
            )}
          </div>
        </div>

        {chef.specialty && (
          <p className="text-[15px] font-sans text-[#4A6357] leading-relaxed line-clamp-2 mb-6 italic">
            "{chef.specialty}"
          </p>
        )}

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-plattr-subtle/50">
            <div className="flex gap-2">
              {chef.is_available && (
                <span className="whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold bg-plattr-tint text-plattr-primary uppercase tracking-wider font-sans flex items-center justify-center">
                  Active
                </span>
              )}
              {chef.years_exp && (
                <span className="whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold bg-plattr-subtle text-plattr-text-sec border border-plattr-border uppercase tracking-wider font-sans flex items-center justify-center">
                  {chef.years_exp}+ Yrs
                </span>
              )}
            </div>
            
            <span className="whitespace-nowrap text-[11px] text-plattr-primary font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1.5">
              Profile
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        </Link>
      </motion.div>
  );
};

export default ChefCard;
