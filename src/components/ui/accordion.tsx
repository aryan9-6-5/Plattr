import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type AccordionItem = { question: string; answer: string };

const Accordion = ({ items }: { items: AccordionItem[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border border-[#D4E8DA] rounded-2xl overflow-hidden divide-y divide-[#E8F5EC]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left group"
          >
            <span className="text-sm font-semibold text-[#1B2D24] group-hover:text-[#2D6A4F] transition-colors">
              {item.question}
            </span>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-[#7A9A88] flex-shrink-0 ml-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm text-[#4A6357] leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
