import { useScroll, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyPlattrSection from "@/components/WhyPlattrSection";
import HowItWorks from "@/components/HowItWorks";
import AudienceSection from "@/components/AudienceSection";
import LifestyleGallery from "@/components/LifestyleGallery";
import ChefsSection from "@/components/ChefsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import CitiesSection from "@/components/CitiesSection";
import B2BSection from "@/components/B2BSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const Index = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#1B4332] selection:text-white">
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-[#1B4332] shadow-[0_2px_10px_rgba(27,67,50,0.3)]"
      />

      <Navbar />
      <CartDrawer />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Pipeline Visualizer — how it works */}
      <HowItWorks />

      {/* 3. Solutions & Audience */}
      <AudienceSection />

      {/* 4. Lifestyle & Catalog */}
      <LifestyleGallery />
      <ChefsSection />

      {/* 5. Why Plattr — value proposition (The Proof) */}
      <WhyPlattrSection />

      {/* 6. Social Proof */}
      <TestimonialsSection />

      {/* 7. Service Areas */}
      <CitiesSection />

      {/* 8. Corporate/B2B */}
      <B2BSection />

      {/* 9. Final CTA */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
