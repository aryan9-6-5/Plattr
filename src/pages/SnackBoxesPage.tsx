import { useState } from "react";
import { Search, ChevronDown, Package, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useSnackPacks } from "@/hooks/useServiceInfrastructure";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/usePlattrToast";

const PORTIONS = ["All", "3", "4", "5", "6"];

const SnackBoxesPage = () => {
  const [activePortion, setActivePortion] = useState("All");
  const [activeDiet, setActiveDiet] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { snacks, loading, error } = useSnackPacks(activeDiet);
  const { addItem } = useCart();
  const { addToast } = useToast();

  const filteredSnacks = snacks.filter(snack => {
    const matchesPortion = activePortion === "All" || snack.serves?.includes(activePortion);
    const matchesSearch = snack.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPortion && matchesSearch;
  });

  const handleAddToCart = (snack: any) => {
    addItem({
      id: snack.id,
      name: snack.name,
      cuisine: "Snack Kit",
      meal_type: "EVENT",
      source_type: "RESTAURANT",
      source_id: "snack-pack",
      source_name: "Plattr Studio",
      price: Number(snack.price),
      quantity: 1,
      image_url: snack.image_url,
      diet_type: snack.diet_type,
      spice_level: "MEDIUM",
      is_spicy: false,
    });
    addToast(`${snack.name} added to cart!`, "success");
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCF8] pt-0">
      {/* Editorial Sidebar */}
      <div className="w-24 md:w-32 shrink-0 border-r border-[#E5E1D8] flex flex-col items-center py-12 gap-10 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar bg-white/50 backdrop-blur-sm">

        {PORTIONS.map((p) => {
          const isActive = activePortion === p;
          const isAll = p === "All";
          return (
            <div 
              key={p}
              onClick={() => setActivePortion(p)}
              className="flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 mb-3
                ${isActive ? "bg-[#1B4332] text-white shadow-2xl scale-110" : "bg-white border border-[#E5E1D8] text-[#4A6357] hover:border-[#1B4332]"}
              `}>
                {isAll ? <Package size={22} className={isActive ? 'text-white' : ''} /> : <span className="font-serif text-xl font-bold">{p}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest text-center transition-colors ${isActive ? "text-[#1B4332]" : "text-[#7A9A88]"}`}>
                {isAll ? "System" : `Pax ${p}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header & Search */}
        <div className="px-8 md:px-16 py-12 border-b border-[#E5E1D8]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
            <div>

              <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1B2D24] tracking-tight leading-none mb-4">
                The Snack <span className="italic">Modulars.</span>
              </h1>
              <p className="text-[#4A6357] font-sans text-lg">Modular kits engineered for team logistics.</p>
            </div>

            <div className="w-full lg:w-96 flex items-center gap-4 px-6 py-4 rounded-2xl border border-[#E5E1D8] focus-within:border-[#1B4332]/40 bg-white transition-all shadow-sm">
              <Search className="w-5 h-5 text-[#7A9A88]" />
              <input
                placeholder="Search the system..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm text-[#1B2D24] placeholder:text-[#7A9A88] outline-none bg-transparent flex-1 font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {["All", "Veg", "Egg", "Non-Veg"].map(diet => (
              <button 
                key={diet}
                onClick={() => setActiveDiet(diet)}
                className={`px-6 py-2 rounded-full text-[11px] font-black tracking-widest uppercase transition-all border
                  ${activeDiet === diet 
                    ? "bg-[#1B4332] text-white border-transparent shadow-lg" 
                    : "bg-white text-[#4A6357] border-[#E5E1D8] hover:border-[#1B4332]"}
                `}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="px-8 md:px-16 py-16 flex-1 bg-[#FDFCF8]">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#1B4332] mb-6" />
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7A9A88]">Syncing Modules...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="text-[#7A9A88] font-serif text-xl italic">Pipeline synchronization failed.</p>
            </div>
          ) : filteredSnacks.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[#7A9A88] font-serif text-2xl italic">No modules found for this parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredSnacks.map((snack, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: idx * 0.04, ease: [0.33, 1, 0.68, 1] }}
                    key={snack.id} 
                    className="bg-white rounded-[40px] overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(27,67,50,0.12)] transition-all duration-700 group flex flex-col"
                  >
                    <div className="bg-[#F3F2EE] aspect-square relative flex items-center justify-center p-10 overflow-hidden">
                      <img src={snack.image_url} alt={snack.name} className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E1D8] text-[10px] font-black uppercase tracking-widest text-[#1B4332]">
                        {snack.serves} Serves
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="font-serif font-bold text-[#1B2D24] text-xl mb-4 group-hover:text-[#1B4332] transition-colors">{snack.name}</h3>
                      <div className="flex items-baseline gap-2 mt-auto mb-8">
                        <span className="font-serif font-bold text-[#1B4332] text-2xl">₹{snack.price}</span>
                        <span className="text-[10px] text-[#7A9A88] font-black uppercase tracking-widest">per serve</span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(snack)}
                        className="w-full py-4 rounded-xl bg-[#1B4332] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#2D6A4F] transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} /> Modular Add
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnackBoxesPage;
