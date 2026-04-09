import { MapPin } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const cities = [
  { name: "Hyderabad", active: true, image: "https://www.formulaindia.com/blog/wp-content/uploads/2021/07/hyd1.jpg" },
  { name: "Bangalore", active: true, image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq_LteLvu96Dp4aVXYlynZWlX05GKFOrh-6K90964uAbRWTNCL16HC13sfG_9gjZUL2Bh471ELsAM5hs6VBte9EYLt8i3f1ujD-nQwZlxCAMR7gTIj0Ep8j5thGVAIlcBPu81kc=w675-h390-n-k-no" },
  { name: "Delhi NCR", active: false, image: "https://www.kalitravel.net/blog/wp-content/uploads/delhi-itinerary-india-gate-sunset-new-delhi.webp" },
];

const CitiesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F6FFF8] border-t border-[#D4E8DA]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <RevealOnScroll direction="up" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF8F1] border border-[#D4E8DA] mb-6">
            <MapPin size={14} className="text-[#2D6A4F]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F]">Service Areas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight tracking-tight">
            Plattr in your city
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {cities.map((city, i) => (
            <RevealOnScroll
              key={city.name}
              direction="up"
              delay={i * 0.12}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] group shadow-lg transition-all duration-500 ${!city.active && 'grayscale'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img 
                src={city.image} 
                alt={city.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 tracking-tight">{city.name}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${city.active ? 'bg-[#52B788] animate-pulse' : 'bg-white/30'}`} />
                  <span className="text-xs text-white/80 font-medium">
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
