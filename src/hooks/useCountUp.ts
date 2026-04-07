import { useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { RefObject } from "react";

export function useCountUp(end: number, duration: number = 2, ref: RefObject<HTMLElement>) {
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure exact finish
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, isInView]);

  return count;
}
