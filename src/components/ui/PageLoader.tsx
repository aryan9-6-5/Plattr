import { motion } from "framer-motion";

const PageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F6FFF8] z-50">
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="font-serif text-3xl font-bold text-[#2D6A4F] mb-8"
    >
      Plattr
    </motion.div>
    <div className="w-48 h-0.5 bg-[#D4E8DA] rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#52B788] rounded-full"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </div>
);

export default PageLoader;
