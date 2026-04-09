import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import RevealOnScroll from "./RevealOnScroll";

const trustSignals = [
  "✓ No minimum orders",
  "✓ FSSAI certified",
  "✓ Cancel anytime",
];

const CtaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" ref={ref}
      style={{ background: "var(--gradient-dark)" }}
    >
      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(82,183,136,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll direction="none" className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-4 block">
            Get Started Today
          </span>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
            Ready to experience authentic food at scale?
          </h2>

          <p className="text-white/65 text-lg mb-10 leading-relaxed">
            Whether you're ordering for one or a thousand, Plattr has your supply chain covered.
          </p>

          {/* Button group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-8">
            <Link
              to="/catalog"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-white hover:bg-gray-100 text-[#1B2D24] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Ordering <ArrowRight size={16} />
            </Link>
            <Link
              to="/for-business"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/50 transition-all duration-300"
            >
              <MessageSquare size={16} />
              Talk to Us
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 mt-12 text-[11px] uppercase tracking-widest font-bold text-white/50">
            {trustSignals.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default CtaSection;
