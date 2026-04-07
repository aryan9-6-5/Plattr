import { Quote } from "lucide-react";
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
  return (
    <section className="py-24 bg-[#0F2318] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Trusted by thousands
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base">
            From daily office goers to corporate event planners, see how Plattr fits every need.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <RevealOnScroll
              key={i}
              direction="up"
              delay={i * 0.1}
              className="bg-white/5 rounded-3xl p-8 border border-white/10 relative"
            >
              <Quote className="w-10 h-10 text-[#52B788]/30 absolute top-6 right-6" />
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#52B788] px-3 py-1 rounded-full bg-[#52B788]/20">
                  {t.type}
                </span>
              </div>
              <p className="text-white/80 leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-white">{t.author}</p>
                <p className="text-xs text-white/50 mt-0.5">{t.role}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
