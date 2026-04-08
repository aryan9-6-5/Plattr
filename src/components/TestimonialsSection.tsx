import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32 bg-[#0F2318] text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#52B788] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Trusted by thousands
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg">
            From daily office goers to corporate event planners.
          </p>
        </RevealOnScroll>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="bg-white/5 rounded-[40px] p-10 md:p-16 border border-white/10 relative backdrop-blur-sm"
            >
              <Quote className="w-16 h-16 text-[#52B788]/20 absolute -top-8 -left-2 rotate-180" />
              
              <div className="mb-10 text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#52B788] px-4 py-1.5 rounded-full bg-[#52B788]/20 ring-1 ring-[#52B788]/40">
                  {testimonials[index].type}
                </span>
              </div>
              
              <p className="text-xl md:text-3xl text-white/90 leading-tight mb-12 italic font-serif text-center">
                "{testimonials[index].quote}"
              </p>
              
              <div className="text-center">
                <p className="font-bold text-lg text-white">{testimonials[index].author}</p>
                <p className="text-sm text-white/40 mt-1 uppercase tracking-widest font-medium">
                  {testimonials[index].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-12 px-4">
            <button 
              onClick={prev}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 
                             ${index === i ? "w-8 bg-[#52B788]" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
