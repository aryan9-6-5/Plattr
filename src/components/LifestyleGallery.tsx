import React from "react";
import InfiniteCurvedSlider from "./ui/InfiniteCurvedSlider";

const galleryItems = [
  { id: 1, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80", title: "The Artisan Kitchen" },
  { id: 2, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80", title: "Heritage Curation" },
  { id: 3, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80", title: "Supply Integrity" },
  { id: 4, image: "https://images.unsplash.com/photo-1556910111-6674b7454a8b?auto=format&fit=crop&q=80", title: "Studio Operations" },
  { id: 5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80", title: "Pure Logistics" },
  { id: 6, image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80", title: "Vetted Sources" },
];

const LifestyleGallery = () => {
  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1B2D24] leading-tight tracking-tight">
          From kitchen to table.
        </h2>
      </div>

      <div className="relative">
        <InfiniteCurvedSlider items={galleryItems} speed={0.5} />
      </div>
    </section>
  );
};

export default LifestyleGallery;
