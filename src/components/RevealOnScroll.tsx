import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Direction = "up" | "left" | "right" | "none";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

const variants = {
  up: {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden:  { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden:  { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
};

const RevealOnScroll = ({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealOnScrollProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
