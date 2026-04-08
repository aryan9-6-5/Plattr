import React from "react";
import InfiniteCurvedSlider from "./ui/InfiniteCurvedSlider";
import RevealOnScroll from "./RevealOnScroll";

const galleryItems = [
  { id: 1, image: "/images/lifestyle-1.jpg", title: "Expert Home Chefs" },
  { id: 2, image: "/images/lifestyle-2.jpg", title: "Fresh Ingredients Daily" },
  { id: 3, image: "/images/lifestyle-3.jpg", title: "Professional Logistics" },
  { id: 4, image: "/images/lifestyle-4.jpg", title: "Premium Corporate Catering" },
  { id: 5, image: "/images/lifestyle-5.jpg", title: "Scaleable Events" },
  { id: 6, image: "/images/lifestyle-6.jpg", title: "Cloud Kitchen Network" },
];

const LifestyleGallery = () => {
  return (
    <section className="bg-[#F6FFF8] py-24 overflow-hidden border-t border-[#D4E8DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <RevealOnScroll direction="up">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Our Ecosystem
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            Built by experts,<br />propelling your business forward
          </h2>
          <p className="text-[#4A6357] max-w-2xl mx-auto mt-4 text-base">
            From content creators capturing the essence of our kitchens to professional logistics partners, we've built a world-class network.
          </p>
        </RevealOnScroll>
      </div>

      <div className="relative">
        <InfiniteCurvedSlider items={galleryItems} speed={0.6} />
      </div>
    </section>
  );
};

export default LifestyleGallery;
