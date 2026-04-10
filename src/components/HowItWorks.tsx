import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Leaf, Cpu, ShieldCheck, Truck, PackageCheck } from "lucide-react";

const steps = [
  {
    label: "Artisan Source",
    desc: "Heritage specialists, verified through a 12-point audit. Generational recipes carrying decades of authenticity.",
    tag: "SOURCE",
    icon: Leaf,
    accent: "#52B788",
  },
  {
    label: "Studio Scaling",
    desc: "Centralized prep kitchens ensure uncompromised precision. Every dish calibrated for consistency at volume.",
    tag: "SCALE",
    icon: Cpu,
    accent: "#40916C",
  },
  {
    label: "Quality Protocol",
    desc: "Every batch verified for thermal and flavor integrity. 6-point sensory checks before any dish leaves the studio.",
    tag: "VERIFY",
    icon: ShieldCheck,
    accent: "#2D6A4F",
    isHero: true,
  },
  {
    label: "Deployment",
    desc: "Optimized logistics for exact 15-minute delivery windows. Temperature-controlled fleet ensures perfection.",
    tag: "DISPATCH",
    icon: Truck,
    accent: "#1B4332",
  },
  {
    label: "Final Recipient",
    desc: "Seamless handoff. Authentic flavors, structured operations, delivered with zero compromise.",
    tag: "DELIVERED",
    icon: PackageCheck,
    accent: "#1B4332",
  },
];

const OFFSETS = [0, 60, 0, 60, 0];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  const rawStep = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 1], [-1, 0, 1, 2, 3, 4]);
  const smoothStep = useSpring(rawStep, { stiffness: 300, damping: 40 });

  /* ── MOBILE: separate scroll tracking on the mobile wrapper ── */
  const mobileSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: mobileScrollY } = useScroll({
    target: mobileSectionRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const mobileLineProgress = useSpring(mobileScrollY, { stiffness: 60, damping: 25 });
  const mobileRawStep = useTransform(mobileScrollY, [0, 0.2, 0.4, 0.6, 0.8, 1], [-1, 0, 1, 2, 3, 4]);
  const mobileSmooth = useSpring(mobileRawStep, { stiffness: 300, damping: 40 });

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP — Sticky cinematic (lg+)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: "400vh" }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center"
          style={{
            background: "linear-gradient(180deg, #F6FFF8 0%, #EDF5EF 50%, #F6FFF8 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-10 w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
              className="mb-16 max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-plattr-subtle border border-plattr-border mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-plattr-primary animate-pulse" />
                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-plattr-secondary">
                  The Pipeline
                </span>
              </div>
              <h2 className="text-6xl font-serif font-bold text-plattr-text leading-[1.05] tracking-tight">
                How food flows through<br />
                a <span className="italic text-plattr-primary">Structured Pipeline.</span>
              </h2>
            </motion.div>

            {/* Desktop pipeline nodes */}
            <div className="relative">
              <div className="absolute top-[36px] left-[36px] right-[36px] h-px bg-[#D4E8DA]/40 z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#52B788] via-[#2D6A4F] to-[#1B4332] origin-left"
                  style={{ scaleX: lineProgress }}
                />
              </div>
              <div className="grid grid-cols-5 gap-6 relative z-10">
                {steps.map((step, idx) => (
                  <StepNode key={step.label} step={step} idx={idx} smoothStep={smoothStep} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE — Natural flow (< lg)
          ═══════════════════════════════════════════════════════════ */}
      <section
        ref={mobileSectionRef}
        className="lg:hidden py-20 relative"
        style={{
          background: "linear-gradient(180deg, #F6FFF8 0%, #EDF5EF 50%, #F6FFF8 100%)",
        }}
      >
        <div className="max-w-xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B4332]/8 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#2D6A4F]">
                The Pipeline
              </span>
            </div>
            <h2 className="text-[32px] sm:text-4xl font-serif font-bold text-[#1B2D24] leading-[1.1] tracking-tight">
              How food flows through
              a <span className="italic text-[#1B4332]">Structured Pipeline.</span>
            </h2>
          </motion.div>

          {/* Mobile pipeline — vertical flow */}
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-[#D4E8DA]/40">
              <motion.div
                className="w-full bg-gradient-to-b from-[#52B788] via-[#2D6A4F] to-[#1B4332] origin-top"
                style={{ scaleY: mobileLineProgress }}
              />
            </div>

            <div className="flex flex-col gap-8">
              {steps.map((step, idx) => (
                <MobileStepNode key={step.label} step={step} idx={idx} smoothStep={mobileSmooth} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ── DESKTOP STEP NODE ── */
interface StepNodeProps {
  step: typeof steps[0];
  idx: number;
  smoothStep: ReturnType<typeof useSpring>;
}

const StepNode = ({ step, idx, smoothStep }: StepNodeProps) => {
  const StepIcon = step.icon;
  const isHero = step.isHero;

  const opacity = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return 1;
    if (rounded > idx) return 0.6;
    return 0.25;
  });

  const scale = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return isHero ? 1.2 : 1.12;
    return 1;
  });

  const nodeBg = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return "#1B4332";
    if (rounded > idx) return "rgba(27,67,50,0.75)";
    return "#FFFFFF";
  });

  const nodeShadow = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return "0 12px 40px rgba(27,67,50,0.15)";
    return "0 4px 20px rgba(0,0,0,0.04)";
  });

  const textColor = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    return rounded >= idx ? "#FFFFFF" : "#9DB4A7";
  });

  return (
    <motion.div
      className="group cursor-pointer"
      style={{
        opacity,
        marginTop: `${OFFSETS[idx]}px`,
      }}
    >
      <div className="flex justify-start mb-7">
        <motion.div
          style={{
            scale,
            backgroundColor: nodeBg,
            boxShadow: nodeShadow,
            color: textColor,
          }}
          className={`
            flex items-center justify-center transition-colors duration-300
            ${isHero ? "w-[80px] h-[80px]" : "w-[72px] h-[72px]"}
            rounded-2xl border border-plattr-border/20
          `}
        >
          <StepIcon size={isHero ? 32 : 26} strokeWidth={1.5} />
        </motion.div>
      </div>

      <div>
        <motion.span
          className="text-[10px] font-black tracking-[0.2em] mb-2 block"
          style={{
            color: useTransform(smoothStep, (v: number) =>
              Math.round(v) >= idx ? step.accent : "#B5C9BD"
            ),
          }}
        >
          {step.tag}
        </motion.span>
        <h3 className={`font-serif font-bold mb-3 text-[#1B2D24] ${isHero ? "text-[22px]" : "text-[19px]"}`}>
          {step.label}
        </h3>
        <p className="text-[13px] leading-[1.7] font-sans font-medium text-[#4A6357] max-w-[220px]">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

/* ── MOBILE STEP NODE ── */
const MobileStepNode = ({ step, idx, smoothStep }: StepNodeProps) => {
  const StepIcon = step.icon;
  const isHero = step.isHero;

  const opacity = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return 1;
    if (rounded > idx) return 0.6;
    return 0.25;
  });

  const scale = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    return rounded === idx ? 1.08 : 1;
  });

  const nodeBg = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return "#1B4332";
    if (rounded > idx) return "rgba(27,67,50,0.75)";
    return "#FFFFFF";
  });

  const nodeShadow = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    if (rounded === idx) return "0 12px 40px rgba(27,67,50,0.15)";
    return "0 4px 20px rgba(0,0,0,0.04)";
  });

  const textColor = useTransform(smoothStep, (v: number) => {
    const rounded = Math.round(v);
    return rounded >= idx ? "#FFFFFF" : "#9DB4A7";
  });

  return (
    <motion.div
      className="flex gap-5 items-start relative z-10"
      style={{ opacity }}
    >
      <motion.div
        style={{
          scale,
          backgroundColor: nodeBg,
          boxShadow: nodeShadow,
          color: textColor,
        }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 border border-plattr-border/10"
      >
        <StepIcon size={22} strokeWidth={1.5} />
      </motion.div>

      <div className="pt-0.5">
        <motion.span
          className="text-[10px] font-black tracking-[0.2em] mb-1 block"
          style={{
            color: useTransform(smoothStep, (v: number) =>
              Math.round(v) >= idx ? step.accent : "#B5C9BD"
            ),
          }}
        >
          {step.tag}
        </motion.span>
        <h3 className={`font-serif font-bold mb-1.5 text-[#1B2D24] ${isHero ? "text-[20px]" : "text-[17px]"}`}>
          {step.label}
        </h3>
        <p className="text-[13px] leading-[1.65] font-sans font-medium text-[#4A6357] max-w-xs">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
