import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setVisible(v > 500));
  }, [scrollY]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={scrollTop}
          className="fixed bottom-32 md:bottom-28 right-6 z-40 w-10 h-10 rounded-full bg-white border border-[#D4E8DA] shadow-md flex items-center justify-center text-[#4A6357] hover:text-[#2D6A4F] hover:border-[#52B788] transition-colors duration-200"
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
