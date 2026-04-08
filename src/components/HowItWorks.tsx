import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ChefHat, Building2, ShieldCheck, Truck, User, UtensilsCrossed, Users, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RevealOnScroll from "./RevealOnScroll";

const primarySteps = [
  {
    icon: ChefHat,
    label: "Home Chef",
    desc: "Verified, skilled, regional specialists",
    tag: "SOURCE",
    threshold: 0,
  },
  {
    icon: Building2,
    label: "Cloud Kitchen",
    desc: "Centralized prep, scale, consistency",
    tag: "SCALE",
    threshold: 0.2,
  },
  {
    icon: ShieldCheck,
    label: "Quality Gate",
    desc: "Every batch checked before dispatch",
    tag: "VERIFY",
    threshold: 0.4,
  },
  {
    icon: Truck,
    label: "Delivery",
    desc: "Temperature-controlled, time-committed",
    tag: "DISPATCH",
    threshold: 0.6,
  },
  {
    icon: User,
    label: "You",
    desc: "Fresh, authentic, delivered on schedule",
    tag: "DELIVERED",
    threshold: 0.8,
  },
];

const serviceTypes = [
  {
    title: "Daily Meals",
    subtitle: "Tiffins & À la carte",
    desc: "Fresh, healthy meals delivered daily. Perfect for working professionals and students.",
    features: ["No minimum order", "Flexible delivery slots", "Rotating daily menu"],
    icon: UtensilsCrossed,
    color: "bg-[#2D6A4F]",
    cta: "Order Now",
    to: "/catalog"
  },
  {
    title: "Bulk & Catering",
    subtitle: "Events & Corporate",
    desc: "Scalable food supply for team lunches, family events, or daily office catering.",
    features: ["Invoice billing", "Dedicated account manager", "Custom menus"],
    icon: Users,
    color: "bg-[#1B2D24]",
    cta: "Contact for Bulk",
    to: "/for-business"
  }
];

// Per-step activation range — wider window so each step fully lights up
const activationRange = (threshold: number): [number, number] => [
  Math.max(0, threshold - 0.05),
  Math.min(1, threshold + 0.12),
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Complete the animation progressively as the user scrolls to the middle of the section
    offset: ["start 80%", "center center"],
  });

  // Snappier spring — completes fully before section exits
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
    restDelta: 0.001,
  });

  // Connector line scale
  const lineScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Pre-compute all per-step transforms at the top level (no hooks in callbacks)
  const step0Active = useTransform(smoothProgress, activationRange(0.00), [0, 1]);
  const step1Active = useTransform(smoothProgress, activationRange(0.20), [0, 1]);
  const step2Active = useTransform(smoothProgress, activationRange(0.40), [0, 1]);
  const step3Active = useTransform(smoothProgress, activationRange(0.60), [0, 1]);
  const step4Active = useTransform(smoothProgress, activationRange(0.80), [0, 1]);

  const step0Scale = useTransform(smoothProgress, [0.00, 0.15], [1, 1.02]);
  const step1Scale = useTransform(smoothProgress, [0.20, 0.35], [1, 1.02]);
  const step2Scale = useTransform(smoothProgress, [0.40, 0.55], [1, 1.02]);
  const step3Scale = useTransform(smoothProgress, [0.60, 0.75], [1, 1.02]);
  const step4Scale = useTransform(smoothProgress, [0.80, 0.95], [1, 1.02]);

  const step0IconBg = useTransform(smoothProgress, activationRange(0.00), ["#F0F4F2", "#2D6A4F"]);
  const step1IconBg = useTransform(smoothProgress, activationRange(0.20), ["#F0F4F2", "#2D6A4F"]);
  const step2IconBg = useTransform(smoothProgress, activationRange(0.40), ["#F0F4F2", "#2D6A4F"]);
  const step3IconBg = useTransform(smoothProgress, activationRange(0.60), ["#F0F4F2", "#2D6A4F"]);
  const step4IconBg = useTransform(smoothProgress, activationRange(0.80), ["#F0F4F2", "#2D6A4F"]);

  const step0LabelColor = useTransform(smoothProgress, activationRange(0.00), ["#7A9A88", "#1B2D24"]);
  const step1LabelColor = useTransform(smoothProgress, activationRange(0.20), ["#7A9A88", "#1B2D24"]);
  const step2LabelColor = useTransform(smoothProgress, activationRange(0.40), ["#7A9A88", "#1B2D24"]);
  const step3LabelColor = useTransform(smoothProgress, activationRange(0.60), ["#7A9A88", "#1B2D24"]);
  const step4LabelColor = useTransform(smoothProgress, activationRange(0.80), ["#7A9A88", "#1B2D24"]);

  const step0BorderColor = useTransform(smoothProgress, activationRange(0.00), ["#D4E8DA", "#52B788"]);
  const step1BorderColor = useTransform(smoothProgress, activationRange(0.20), ["#D4E8DA", "#52B788"]);
  const step2BorderColor = useTransform(smoothProgress, activationRange(0.40), ["#D4E8DA", "#52B788"]);
  const step3BorderColor = useTransform(smoothProgress, activationRange(0.60), ["#D4E8DA", "#52B788"]);
  const step4BorderColor = useTransform(smoothProgress, activationRange(0.80), ["#D4E8DA", "#52B788"]);

  const step0BoxShadow = useTransform(smoothProgress, activationRange(0.00), [
    "0 1px 4px rgba(27,67,50,0.08), 0 0 0 1px #D4E8DA",
    "0 8px 24px rgba(27,67,50,0.12), 0 0 0 2px rgba(82,183,136,0.3)"
  ]);
  const step1BoxShadow = useTransform(smoothProgress, activationRange(0.20), [
    "0 1px 4px rgba(27,67,50,0.08), 0 0 0 1px #D4E8DA",
    "0 8px 24px rgba(27,67,50,0.12), 0 0 0 2px rgba(82,183,136,0.3)"
  ]);
  const step2BoxShadow = useTransform(smoothProgress, activationRange(0.40), [
    "0 1px 4px rgba(27,67,50,0.08), 0 0 0 1px #D4E8DA",
    "0 8px 24px rgba(27,67,50,0.12), 0 0 0 2px rgba(82,183,136,0.3)"
  ]);
  const step3BoxShadow = useTransform(smoothProgress, activationRange(0.60), [
    "0 1px 4px rgba(27,67,50,0.08), 0 0 0 1px #D4E8DA",
    "0 8px 24px rgba(27,67,50,0.12), 0 0 0 2px rgba(82,183,136,0.3)"
  ]);
  const step4BoxShadow = useTransform(smoothProgress, activationRange(0.80), [
    "0 1px 4px rgba(27,67,50,0.08), 0 0 0 1px #D4E8DA",
    "0 8px 24px rgba(27,67,50,0.12), 0 0 0 2px rgba(82,183,136,0.3)"
  ]);

  // Icon color transforms (must be at top level, not inside .map())
  const step0IconColor = useTransform(step0Active, [0, 1], ["#7A9A88", "#FFFFFF"]);
  const step1IconColor = useTransform(step1Active, [0, 1], ["#7A9A88", "#FFFFFF"]);
  const step2IconColor = useTransform(step2Active, [0, 1], ["#7A9A88", "#FFFFFF"]);
  const step3IconColor = useTransform(step3Active, [0, 1], ["#7A9A88", "#FFFFFF"]);
  const step4IconColor = useTransform(step4Active, [0, 1], ["#7A9A88", "#FFFFFF"]);

  // Bundle per-step derived values for use in render
  const stepAnimations = [
    { active: step0Active, scale: step0Scale, iconBg: step0IconBg, iconColor: step0IconColor, labelColor: step0LabelColor, borderColor: step0BorderColor, boxShadow: step0BoxShadow },
    { active: step1Active, scale: step1Scale, iconBg: step1IconBg, iconColor: step1IconColor, labelColor: step1LabelColor, borderColor: step1BorderColor, boxShadow: step1BoxShadow },
    { active: step2Active, scale: step2Scale, iconBg: step2IconBg, iconColor: step2IconColor, labelColor: step2LabelColor, borderColor: step2BorderColor, boxShadow: step2BoxShadow },
    { active: step3Active, scale: step3Scale, iconBg: step3IconBg, iconColor: step3IconColor, labelColor: step3LabelColor, borderColor: step3BorderColor, boxShadow: step3BoxShadow },
    { active: step4Active, scale: step4Scale, iconBg: step4IconBg, iconColor: step4IconColor, labelColor: step4LabelColor, borderColor: step4BorderColor, boxShadow: step4BoxShadow },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 md:py-28 relative bg-[#F6FFF8] bg-grid-plattr min-h-[600px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <RevealOnScroll direction="up" className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            The Plattr System
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            Food flows through a verified pipeline
          </h2>
          <p className="text-[#4A6357] max-w-lg mx-auto mt-4 text-base">
            Every meal traces a controlled path from source to your door.
          </p>
        </RevealOnScroll>

        {/* ── Desktop Pipeline ── */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Static background connector line */}
            <div className="absolute h-0.5 bg-[#D4E8DA]" style={{ top: "3.5rem", left: "10%", right: "10%" }} />

            {/* Animated progress line */}
            <motion.div
              className="absolute h-0.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] origin-left"
              style={{ top: "3.5rem", left: "10%", right: "10%", scaleX: lineScaleX }}
            />

            {/* Steps */}
            <div className="flex items-start justify-between px-[10%]">
              {primarySteps.map((step, i) => {
                const anim = stepAnimations[i];
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.label}
                    className="relative flex flex-col items-center text-center"
                    style={{ width: "18%", scale: anim.scale }}
                  >
                    {/* Tag badge */}
                    <motion.span
                      style={{ opacity: anim.active }}
                      className="text-[10px] font-bold tracking-widest uppercase text-[#52B788] mb-2 h-4"
                    >
                      {step.tag}
                    </motion.span>

                    {/* Step number */}
                    <motion.div
                      style={{ borderColor: anim.borderColor }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 text-[10px] font-bold text-[#4A6357] flex items-center justify-center z-10"
                    >
                      {i + 1}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      style={{ boxShadow: anim.boxShadow }}
                      className="w-full p-5 rounded-2xl text-center bg-white transition-colors duration-500 mt-2"
                    >
                      {/* Icon circle */}
                      <motion.div
                        style={{ backgroundColor: anim.iconBg }}
                        className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-colors duration-500"
                      >
                        <motion.span style={{ color: anim.iconColor }}>
                          <StepIcon className="w-7 h-7" />
                        </motion.span>
                      </motion.div>

                      {/* Pulse node */}
                      <motion.div
                        style={{ opacity: anim.active }}
                        className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse-ring mx-auto mb-2"
                      />

                      <motion.p
                        style={{ color: anim.labelColor }}
                        className="text-sm font-semibold leading-tight"
                      >
                        {step.label}
                      </motion.p>
                      <p className="text-xs text-[#7A9A88] mt-1 leading-snug">{step.desc}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile Pipeline — vertical ── */}
        <div className="md:hidden max-w-sm mx-auto relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#D4E8DA]" />
          <div className="space-y-4">
            {primarySteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <RevealOnScroll key={step.label} direction="left" delay={i * 0.1}>
                  <div className="relative pl-16 py-4">
                    <div className="absolute left-3.5 top-6 w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center z-10">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-card border border-[#D4E8DA]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
                          <StepIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#52B788] block">{step.tag}</span>
                          <h3 className="text-sm font-semibold text-[#1B2D24]">{step.label}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-[#7A9A88] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

        {/* Service Cards */}
        <RevealOnScroll direction="up" delay={0.3} className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif font-bold text-[#1B2D24]">Two ways to order</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {serviceTypes.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div key={service.title} className="bg-white rounded-3xl p-8 shadow-sm border border-[#D4E8DA] flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 text-white shadow-md`}>
                    <ServiceIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1B2D24] mb-1">{service.title}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#52B788] mb-4">{service.subtitle}</p>
                  <p className="text-sm text-[#4A6357] leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <ul className="space-y-2 mt-auto w-full text-left">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#4A6357] font-medium bg-[#EEF8F1] px-4 py-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 w-full group">
                    <Link to={service.to}>
                      <Button className={`w-full h-11 rounded-xl gap-2 ${service.color} hover:opacity-90 text-white transition-all`}>
                        {service.cta} <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Transition */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-14 text-sm text-[#7A9A88]"
        >
          Now see what the system produces ↓
        </motion.p>
      </div>
    </section>
  );
};

export default HowItWorks;
