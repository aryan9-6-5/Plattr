import { useRef, useEffect, useCallback } from "react";

const steps = [
  {
    tag: "SOURCE",
    label: "Artisan Source",
    desc: "Heritage specialists, verified through a 12-point audit. Generational recipes carrying decades of authenticity.",
    accent: "#74C69D",
  },
  {
    tag: "SCALE",
    label: "Studio Scaling",
    desc: "Centralized prep kitchens ensure uncompromised precision. Every dish calibrated for consistency at volume.",
    accent: "#95D5B2",
  },
  {
    tag: "VERIFY",
    label: "Quality Protocol",
    desc: "Every batch verified for thermal and flavor integrity. 6-point sensory checks before any dish leaves the studio.",
    accent: "#B7E4C7",
  },
  {
    tag: "DISPATCH",
    label: "Deployment",
    desc: "Optimized logistics for exact 15-minute delivery windows. Temperature-controlled fleet ensures perfection.",
    accent: "#74C69D",
  },
  {
    tag: "DELIVERED",
    label: "Final Recipient",
    desc: "Seamless handoff. Authentic flavors, structured operations, delivered with zero compromise.",
    accent: "#95D5B2",
  },
];

const TOTAL = steps.length;
const S = 0.15;
const E = 0.92;
const SEG = (E - S) / TOTAL;

/* ─── helper: clamp ─── */
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ─── helper: smooth interpolation between keyframe pairs ─── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterNumRef = useRef<HTMLSpanElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const tick = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const p = clamp(-rect.top / scrollable, 0, 1); // 0..1 progress

    /* ── Heading: fade 0→0.06 hold, 0.06→0.13 fade out ── */
    const h = headingRef.current;
    if (h) {
      const ho = p < 0.06 ? 1 : p > 0.13 ? 0 : 1 - (p - 0.06) / 0.07;
      const hy = -(p / 0.13) * 40;
      h.style.opacity = String(clamp(ho, 0, 1));
      h.style.transform = `translateY(${clamp(hy, -40, 0)}px)`;
    }

    /* ── Train: horizontal slide ── */
    const train = trainRef.current;
    if (train) {
      const isDesktop = window.innerWidth >= 1024;
      // Align movement so each card is centered during its mid-progress
      const pStart = S + 0.5 * SEG;
      const pEnd = E - 0.5 * SEG;
      const tp = clamp((p - pStart) / (pEnd - pStart), 0, 1);

      // Desktop: 32vw → -120vw  |  Mobile: 9vw → -339vw
      const startX = isDesktop ? 32 : 9;
      const endX = isDesktop ? -120 : -339;
      const xVw = lerp(startX, endX, tp);

      // Fade in 0.10→0.18, hold, fade out 0.90→0.96
      let trainO: number;
      if (p < 0.10) trainO = 0;
      else if (p < 0.18) trainO = (p - 0.10) / 0.08;
      else if (p < 0.90) trainO = 1;
      else if (p < 0.96) trainO = 1 - (p - 0.90) / 0.06;
      else trainO = 0;

      train.style.transform = `translateX(${xVw}vw)`;
      train.style.opacity = String(clamp(trainO, 0, 1));
    }

    /* ── Cards: plateau opacity + scale ── */
    for (let i = 0; i < TOTAL; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;

      const c = S + (i + 0.5) * SEG;
      const dist = Math.abs(p - c);
      const halfPlateau = SEG * 0.35; // stay full for ±35% of segment

      let opacity: number;
      let scale: number;

      if (dist < halfPlateau) {
        // plateau — full brightness and scale
        opacity = 1;
        scale = 1.05;
      } else {
        const fadeRange = SEG * 0.45;
        const t = clamp((dist - halfPlateau) / fadeRange, 0, 1);
        opacity = lerp(1, 0.04, t);
        scale = lerp(1.05, 0.91, t);
      }

      card.style.opacity = String(opacity);
      card.style.transform = `scale(${scale})`;
    }

    /* ── Global fade factor (matches train) ── */
    let globalO: number;
    if (p < 0.10) globalO = 0;
    else if (p < 0.18) globalO = (p - 0.10) / 0.08;
    else if (p < 0.90) globalO = 1;
    else if (p < 0.96) globalO = 1 - (p - 0.90) / 0.06;
    else globalO = 0;

    /* ── Dots ── */
    if (dotsContainerRef.current) {
      dotsContainerRef.current.style.opacity = String(clamp(globalO, 0, 1));
    }
    for (let i = 0; i < TOTAL; i++) {
      const dot = dotRefs.current[i];
      if (!dot) continue;
      const c = S + (i + 0.5) * SEG;
      const active = Math.abs(p - c) < SEG * 0.4;
      dot.style.transform = `scale(${active ? 2.2 : 1})`;
      dot.style.opacity = active ? "1" : "0.25";
    }

    /* ── Counter ── */
    if (counterRef.current && counterNumRef.current) {
      counterRef.current.style.opacity = String(clamp(globalO, 0, 1));
      const idx = clamp(Math.floor((p - S) / SEG) + 1, 1, TOTAL);
      counterNumRef.current.textContent = String(idx).padStart(2, "0");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick(); // initial position
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [tick]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative"
      style={{ height: "600vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ═════ VIDEO ═════ */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(2px) brightness(0.7) saturate(0.85)" }}
            src="/assets/avity.mp4"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,20,14,0.75) 0%, rgba(10,28,18,0.45) 50%, rgba(8,20,14,0.80) 100%)",
            }}
          />
        </div>

        {/* ═════ HEADING ═════ */}
        <div
          ref={headingRef}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none will-change-[transform,opacity]"
        >
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#B7E4C7]">
                The Pipeline
              </span>
            </div>
            <h2 className="text-[38px] sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.08] tracking-tight drop-shadow-lg">
              How food flows through<br />
              a <span className="italic text-[#52B788]">Structured Pipeline.</span>
            </h2>
          </div>
        </div>

        {/* ═════ TRAIN ═════ */}
        <div className="absolute inset-0 flex items-center z-10">
          <div
            ref={trainRef}
            className="flex gap-[3vw] lg:gap-[3vw] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="w-[82vw] min-w-[82vw] lg:w-[35vw] lg:min-w-[35vw] shrink-0 px-8 py-10 lg:px-10 lg:py-14 rounded-3xl border border-white/[0.12] shadow-2xl will-change-[transform,opacity]"
                style={{ background: "rgba(10, 22, 15, 0.88)", opacity: 0.04 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="text-[15px] font-black tracking-[0.2em] font-sans drop-shadow-lg"
                    style={{ color: step.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-px" style={{ backgroundColor: step.accent }} />
                  <span
                    className="text-[12px] font-black tracking-[0.25em] uppercase font-sans drop-shadow-lg"
                    style={{ color: step.accent }}
                  >
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-[36px] sm:text-[44px] lg:text-[52px] font-serif font-bold text-white leading-[1.05] tracking-tight mb-5 drop-shadow-xl">
                  {step.label}
                </h3>
                <p className="text-[16px] sm:text-[18px] leading-[1.85] font-sans font-semibold text-white/95 max-w-md drop-shadow-md">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═════ DOTS ═════ */}
        <div ref={dotsContainerRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="w-2.5 h-2.5 rounded-full bg-[#52B788] shadow-[0_0_12px_rgba(82,183,136,0.5)] will-change-[transform,opacity]"
              style={{ transition: "transform 0.2s, opacity 0.2s" }}
            />
          ))}
        </div>

        {/* ═════ STEP COUNTER ═════ */}
        <div
          ref={counterRef}
          className="absolute top-10 right-10 z-20 flex items-baseline gap-1 font-sans"
          style={{ opacity: 0 }}
        >
          <span
            ref={counterNumRef}
            className="text-[36px] font-black text-white tracking-tight drop-shadow-lg"
          >
            01
          </span>
          <span className="text-[16px] font-bold text-white/50 tracking-wide ml-1">
            / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
