import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const metrics = [
  {
    number: "40+",
    label: "Verified Suppliers",
    detail: "Same-day sourced from regional micro-markets",
  },
  {
    number: "98.4%",
    label: "On-Time Rate",
    detail: "Within a strict 15-minute thermal window",
  },
  {
    number: "100%",
    label: "FSSAI Audited",
    detail: "Monthly kitchen inspections, no exceptions",
  },
  {
    number: "₹0",
    label: "Surge Pricing",
    detail: "Flat institutional rates, always",
  },
];

const MetricBlock = ({ metric, index }: { metric: typeof metrics[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-serif font-bold text-white leading-none tracking-tighter block transition-all duration-500 group-hover:text-[#52B788] group-hover:scale-[1.03] origin-left">
        {metric.number}
      </span>

      <div className="w-12 h-px bg-white/15 mt-5 mb-4 transition-all duration-700 group-hover:w-full group-hover:bg-[#52B788]/40" />

      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80 mb-2">
        {metric.label}
      </h3>
      <p className="text-sm text-white/30 leading-relaxed max-w-[240px]">
        {metric.detail}
      </p>
    </motion.div>
  );
};

const WhyPlattrSection = () => {
  return (
    <section className="relative bg-[#0A1A10] py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 md:mb-28">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter max-w-4xl"
          >
            We don't claim<br />reliability.{" "}
            <span className="italic text-[#52B788]/50">We prove it.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-16">
          {metrics.map((metric, idx) => (
            <MetricBlock key={metric.label} metric={metric} index={idx} />
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent origin-left"
        />
      </div>
    </section>
  );
};

export default WhyPlattrSection;
