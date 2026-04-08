import { MapPin } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const cities = [
  { name: "Hyderabad", active: true, image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=800" },
  { name: "Bangalore", active: true, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800" },
  { name: "Delhi NCR", active: false, image: "https://www.kalitravel.net/blog/wp-content/uploads/delhi-itinerary-india-gate-sunset-new-delhi.webp" },
];

const CitiesSection = () => {
  return (
    <section className="py-24 bg-[#F6FFF8] border-t border-[#D4E8DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF8F1] border border-[#D4E8DA] rounded-full text-xs font-bold tracking-widest uppercase text-[#2D6A4F] mb-4">
            <MapPin size={12} /> Service Areas
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24]">
            Plattr in your city
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {cities.map((city, i) => (
            <RevealOnScroll
              key={city.name}
              direction="up"
              delay={i * 0.1}
              className={`relative rounded-3xl overflow-hidden aspect-[4/5] group ${!city.active && 'grayscale opacity-80'}`}
            >
              <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20" />
              <img 
                src={city.image} 
                alt={city.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-serif font-bold text-white mb-2">{city.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${city.active ? 'bg-[#52B788] animate-pulse' : 'bg-white/50'}`} />
                  <span className="text-sm font-semibold text-white/90">
                    {city.active ? "Live & Delivering" : "Coming soon"}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
