import React, { useEffect, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface SliderItem {
  id: string | number;
  image: string;
  title?: string;
}

interface InfiniteCurvedSliderProps {
  items: SliderItem[];
  speed?: number;
  direction?: "left" | "right";
}

const InfiniteCurvedSlider = ({ 
  items, 
  speed = 3.5, 
  direction = "left" 
}: InfiniteCurvedSliderProps) => {
  const [metrics, setMetrics] = useState({ width: 320, gap: 40 });
  
  const duplicatedItems = [...items, ...items, ...items];
  const baseX = useMotionValue(0);
  
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) {
        setMetrics({ width: 240, gap: 24 }); // mobile w-[240px] gap-6 (24px)
      } else {
        setMetrics({ width: 320, gap: 40 }); // desktop w-[320px] gap-10 (40px)
      }
    };
    
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useAnimationFrame((t, delta) => {
    // Increase base speed for snappier mobile feel if requested
    let moveBy = direction === "left" ? -speed : speed;
    moveBy *= delta / 16;
    
    const currentX = baseX.get();
    const itemWidth = metrics.width + metrics.gap;
    const totalContentWidth = items.length * itemWidth;
    
    let newX = currentX + moveBy;
    
    if (newX <= -totalContentWidth) {
      newX = 0;
    } else if (newX > 0) {
      newX = -totalContentWidth;
    }
    
    baseX.set(newX);
  });

  return (
    <div className="relative w-full overflow-hidden py-6 md:py-10 bg-[#F6FFF8]">
      <motion.div 
        className="flex gap-6 md:gap-10 px-6 md:px-10"
        style={{ x: baseX }}
      >
        {duplicatedItems.map((item, index) => (
          <SliderCard key={`${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

const SliderCard = ({ item }: { item: SliderItem }) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className="flex-shrink-0 w-[240px] h-[340px] md:w-[320px] md:h-[450px] relative rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] group cursor-pointer transition-all duration-700"
    >
      <img 
        src={item.image} 
        alt={item.title || "Gallery Image"} 
        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-6 md:p-10">
        {item.title && (
          <p className="text-white font-serif text-xl md:text-2xl font-bold leading-tight">{item.title}</p>
        )}
      </div>
      
      {/* Decorative frame */}
      <div className="absolute inset-0 border border-white/10 rounded-[40px] md:rounded-[60px] pointer-events-none" />
    </motion.div>
  );
};

export default InfiniteCurvedSlider;
