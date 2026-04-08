import { useScroll } from "framer-motion";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import CatalogSection from "@/components/CatalogSection";
import AudienceSection from "@/components/AudienceSection";
import ChefsSection from "@/components/ChefsSection";
import PartnersSection from "@/components/PartnersSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import WhyPlattrSection from "@/components/WhyPlattrSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CitiesSection from "@/components/CitiesSection";
import B2BSection from "@/components/B2BSection";

const Index = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-0.5 z-[100] bg-gradient-to-r from-[#2D6A4F] to-[#52B788]"
      />

      <Navbar />
      <div className="h-16 sm:h-20 shrink-0" /> {/* Navbar Clearance */}
      
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. Problem/Solution */}
      <ProblemSolution />
      
      {/* 3. Pipeline (HowItWorks) */}
      <HowItWorks />
      
      {/* 4. Why Plattr Grids */}
      <WhyPlattrSection />
      
      {/* 5. Catalog Preview */}
      <CatalogSection />
      
      {/* 6. Audience (Who is it for) */}
      <AudienceSection />
      
      {/* 7. Chefs/Partners grid */}
      <ChefsSection />
      <PartnersSection />
      
      {/* 8. Testimonials (3 quotes) */}
      <TestimonialsSection />
      
      {/* 9. Cities */}
      <CitiesSection />
      
      {/* 10. B2B Quick Form */}
      <B2BSection />
      
      {/* 11. Final CTA */}
      <CtaSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
