import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";

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
  speed = 0.5, 
  direction = "left" 
}: InfiniteCurvedSliderProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a looped set of items to ensure seamless scrolling
  const duplicatedItems = [...items, ...items, ...items];
  
  const baseX = useMotionValue(0);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useAnimationFrame((t, delta) => {
    let moveBy = direction === "left" ? -speed : speed;
    
    // Adjust speed based on delta for smoothness
    moveBy *= delta / 16;
    
    const currentX = baseX.get();
    const itemWidth = 320; // 280px width + 40px gap
    const totalContentWidth = items.length * itemWidth;
    
    let newX = currentX + moveBy;
    
    // Loop the value
    if (newX <= -totalContentWidth) {
      newX = 0;
    } else if (newX > 0) {
      newX = -totalContentWidth;
    }
    
    baseX.set(newX);
  });

  return (
    <div className="relative w-full overflow-hidden py-20 bg-[#F6FFF8]">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F6FFF8] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F6FFF8] to-transparent z-10" />
      
      <motion.div 
        ref={containerRef}
        className="flex gap-10 px-10"
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
      whileHover={{ y: -10, scale: 1.02 }}
      className="flex-shrink-0 w-[280px] h-[380px] relative rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer"
      style={{
        // The "curved" effect from screenshot 2 is partly achieved by a slight perspective/warp
        // or just very generous border radii and shadow.
        borderRadius: "60px 60px 60px 60px",
      }}
    >
      <img 
        src={item.image} 
        alt={item.title || "Gallery Image"} 
        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
        {item.title && (
          <p className="text-white font-serif text-lg font-bold">{item.title}</p>
        )}
      </div>
    </motion.div>
  );
};

export default InfiniteCurvedSlider;
