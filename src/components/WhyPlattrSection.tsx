import { motion } from "framer-motion";
import { Leaf, Clock, ThumbsUp, Wallet } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Every dish is prepared using fresh, locally-sourced ingredients on the day of delivery. No frozen meals, no preservatives.",
  },
  {
    icon: Clock,
    title: "Always on Time",
    desc: "Our delivery network is optimized for exact slot timings. Whether it's daily tiffin or a 500-person event, we deliver.",
  },
  {
    icon: ThumbsUp,
    title: "FSSAI Verified",
    desc: "100% of our network partners are audited for hygiene, taste quality, and hold active FSSAI credentials.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    desc: "No hidden fees, no surge pricing. Bulk orders automatically qualify for volume discounts. Pay for exactly what you eat.",
  },
];

const WhyPlattrSection = () => {
  return (
    <section className="bg-white py-24 md:py-32 border-t border-[#D4E8DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            Built for reliability
          </h2>
          <p className="text-[#4A6357] max-w-xl mx-auto mt-4 text-base">
            We handle the complexity of food sourcing so you can focus on eating. Quality, hygiene, and timely delivery guaranteed.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <RevealOnScroll
              key={feat.title}
              direction="up"
              delay={0.1 * index}
              className="bg-[#F6FFF8] rounded-3xl p-8 border border-[#D4E8DA] shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Decorative top corner flair */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#D8F3DC] rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center opacity-50" />
              
              <div className="w-14 h-14 bg-[#2D6A4F] text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10">
                <feat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B2D24] mb-3 relative z-10">{feat.title}</h3>
              <p className="text-sm text-[#4A6357] leading-relaxed relative z-10">
                {feat.desc}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPlattrSection;
