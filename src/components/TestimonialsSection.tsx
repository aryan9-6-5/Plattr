import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "Plattr solves the daily lunch problem perfectly. I subscribe for 20 days and get fresh, non-repetitive meals delivered hot. It feels like home food because it is.",
    author: "Rahul S.",
    role: "Software Engineer",
    type: "Daily Tiffin"
  },
  {
    quote: "We used Plattr for a 200-person corporate event. The dashboard let us mix 3 different cuisines from 3 chefs, but it all arrived together. Flawless execution.",
    author: "Meera K.",
    role: "HR Manager",
    type: "Bulk Event"
  },
  {
    quote: "Finding authentic Chettinad food outside of Tamil Nadu was hard until I found a regional specialist on Plattr. The spice levels and flavors are completely uncompromised.",
    author: "Vikram N.",
    role: "Food Enthusiast",
    type: "À la carte"
  }
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-28 md:py-40 bg-[#FDFCF8]">
      <div className="max-w-5xl mx-auto px-6">

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* The quote IS the section. No card. No box. */}
            <p className="text-3xl md:text-5xl lg:text-6xl text-[#1B2D24] leading-[1.15] font-serif italic tracking-tight max-w-4xl mx-auto mb-16">
              "{testimonials[index].quote}"
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-[#1B4332]/30" />
              <div>
                <span className="text-sm font-bold text-[#1B2D24]">{testimonials[index].author}</span>
                <span className="text-sm text-[#7A9A88] ml-2">— {testimonials[index].role}</span>
              </div>
              <div className="w-8 h-px bg-[#1B4332]/30" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimal controls */}
        <div className="flex items-center justify-center gap-8 mt-16">
          <button onClick={prev} className="text-sm text-[#7A9A88] hover:text-[#1B4332] transition-colors font-medium">
            ←  Prev
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button 
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 
                           ${index === i ? "w-8 bg-[#1B4332]" : "w-2 bg-[#D4E8DA]"}`}
              />
            ))}
          </div>
          <button onClick={next} className="text-sm text-[#7A9A88] hover:text-[#1B4332] transition-colors font-medium">
            Next  →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
