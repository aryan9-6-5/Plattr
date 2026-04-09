import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Leaf, Cpu, ShieldCheck, Truck, Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import RevealOnScroll from "./RevealOnScroll";

const primarySteps = [
  {
    label: "Artisan Source",
    desc: "Heritage specialists, verified through a 12-point audit.",
    tag: "SOURCE",
    icon: Leaf,
  },
  {
    label: "Studio Scaling",
    desc: "Centralized prep, ensuring uncompromised precision.",
    tag: "SCALE",
    icon: Cpu,
  },
  {
    label: "Quality Protocol",
    desc: "Every batch verified for thermal and flavor integrity.",
    tag: "VERIFY",
    icon: ShieldCheck,
  },
  {
    label: "Deployment",
    desc: "Optimized logistics for exact 15-minute windows.",
    tag: "DISPATCH",
    icon: Truck,
  },
  {
    label: "Final Recipient",
    desc: "Seamless handoff. Authentic. Structured. Delivered.",
    tag: "DELIVERED",
    icon: Ghost,
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.4", "end 0.6"],
  });

  // Map scroll progress to step index
  const stepIndex = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8], [0, 1, 2, 3, 4]);

  useEffect(() => {
    return stepIndex.onChange((latest) => {
      const rounded = Math.round(latest);
      if (rounded !== activeStep) {
        setActiveStep(rounded);
      }
    });
  }, [activeStep, stepIndex]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-12 md:py-24 relative bg-[#F6FFF8] overflow-hidden"
    >


      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="text-left mb-20 max-w-2xl"
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#1B2D24] leading-[1.05] tracking-tight">
            How food flows through <br />a <span className="italic italic-font-serif text-[#1B4332]">Structured Pipeline.</span>
          </h2>
          <p className="text-xl text-[#4A6357] mt-10 font-sans leading-relaxed">
            Every plate traces a controlled journey from heritaged source to enterprise-scale distribution. Authenticity, engineered.
          </p>
        </motion.div>

        {/* The Pipeline Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 relative pb-20">
          
          {/* Vertical line with progress */}
          <div className="absolute left-[39px] lg:left-0 lg:top-[39px] lg:h-px lg:w-full h-full w-px bg-[#D4E8DA] z-0">
             <motion.div 
               className="h-full lg:h-px w-px lg:w-full bg-[#1B4332]" 
               style={{ scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }) }} 
             />
          </div>
          
          {primarySteps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = activeStep === idx;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="relative z-10 group cursor-pointer"
                onMouseEnter={() => setActiveStep(idx)}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative z-20
                                 ${isActive ? "bg-[#1B4332] text-white" : "bg-white text-[#1B4332] border border-[#D4E8DA]"}`}>
                  <StepIcon size={24} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="mt-8 pl-24 lg:pl-0">
                  <span className="text-[10px] font-black tracking-widest text-[#52B788] mb-2 block">{step.tag}</span>
                  <h3 className={`text-2xl font-serif font-bold mb-4 transition-colors duration-500
                                   ${isActive ? "text-[#1B4332]" : "text-[#1B2D24]"}`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-[#4A6357] leading-relaxed font-sans max-w-xs opacity-80 font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        </div>
    </section>
  );
};

export default HowItWorks;
