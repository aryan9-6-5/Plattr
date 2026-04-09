import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChefHat, ShieldCheck, Truck, Utensils, Heart, ArrowDown } from "lucide-react";

const pipelineSteps = [
  { 
    icon: ChefHat, 
    title: "Artisanal Sourcing", 
    text: "Direct partnerships with certified home chefs specializing in authentic regional cuisines.",
    stat: "40+ Cuisines"
  },
  { 
    icon: ShieldCheck, 
    title: "The Quality Filter", 
    text: "Rigorous 3-step vetting for every chef. Random batch testing at our central lab.",
    stat: "Zero Failure Rate"
  },
  { 
    icon: Utensils, 
    title: "Precision Prep", 
    text: "Meals are prepared in small batches, preserving the 'Ghar jaisa' taste while meeting FSSAI standards.",
    stat: "FSSAI Certified"
  },
  { 
    icon: Truck, 
    title: "Optimized Logistics", 
    text: "Smart-routed bulk delivery that reduces shipping costs by 30% for corporate clients.",
    stat: "30% Lower Cost"
  },
];

const SupplyPipelineVisualizer = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-16 md:py-24 bg-[#F6FFF8] relative overflow-hidden" ref={containerRef}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1B4332]/[0.02] -skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1B2D24] leading-[1.1] mb-8">
              A transparent system,<br />not just a delivery app.
            </h2>
            <p className="text-lg text-[#4A6357] leading-relaxed max-w-xl font-sans">
              We've re-engineered the food supply chain to bring artisanal quality to industrial scale. Follow the journey from a chef's kitchen to your table.
            </p>
          </motion.div>
        </div>

        {/* Pipeline Body */}
        <div className="relative">
          {/* Central Connecting Line (SVG) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D4E8DA" strokeWidth="2" strokeDasharray="8 8" />
              <motion.line 
                x1="50%" y1="0" x2="50%" y2="100%" 
                stroke="#1B4332" 
                strokeWidth="2"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* Pipeline Nodes */}
          <div className="space-y-24 md:space-y-32 relative">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row items-start gap-8 md:gap-0 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className={`w-full md:w-[42%] ${i % 2 === 0 ? 'text-left' : 'md:text-right'}`}>
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-white shadow-md border border-[#D4E8DA] mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <step.icon className="w-8 h-8 text-[#1B4332]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1B2D24] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-[#4A6357] leading-relaxed mb-6 font-sans">
                    {step.text}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B4332]/5 text-[#1B4332] text-xs font-bold uppercase tracking-wider font-sans`}>
                    {step.stat}
                  </div>
                </div>

                {/* Node Side (Center) */}
                <div className="hidden md:flex w-[16%] justify-center mt-12">
                   <div className="w-12 h-12 rounded-full bg-white border-4 border-[#1B4332] shadow-xl z-10 flex items-center justify-center">
                     <span className="text-[14px] font-black text-[#1B4332]">{i + 1}</span>
                   </div>
                </div>

                {/* Mobile/Empty Side */}
                <div className="w-full md:w-[42%]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing Hint */}
        <motion.div 
          className="mt-32 md:mt-48 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-block p-6 rounded-3xl bg-[#1B4332] text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 font-sans">Curious for more?</p>
            <h4 className="text-2xl font-serif font-bold flex items-center gap-3">
              Explore Our Catalog
              <ArrowDown className="w-6 h-6 animate-bounce" />
            </h4>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SupplyPipelineVisualizer;
