import { Link, useLocation } from "react-router-dom";

const services = [
  { label: "Full Spectrum", href: "/catalog" },
  { label: "MealBox Module", href: "/mealbox-builder" },
  { label: "Bulk Shipments", href: "/catalog?meal_type=BULK" },
  { label: "Snack Components", href: "/snack-boxes" },
  { label: "Curation Bundles", href: "/combos" },
  { label: "Studio Access", href: "/for-business" },
];

const ServiceSubNav = () => {
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;

  return (
    <div className="w-full bg-[#F6FFF8]/90 backdrop-blur-xl border-b border-[#D4E8DA] overflow-x-auto no-scrollbar z-40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-2 flex items-center gap-3 md:gap-4">

        {services.map((service) => {
          const isActive = 
            (service.href === "/catalog" && currentPath === "/catalog") ||
            (service.href !== "/catalog" && currentPath.startsWith(service.href));

          return (
            <Link
              key={service.label}
              to={service.href}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${
                isActive
                  ? "bg-[#1B4332] text-white shadow-xl shadow-[#1B4332]/20 scale-105"
                  : "bg-transparent text-[#7A9A88] hover:bg-[#1B4332]/5 hover:text-[#1B4332]"
              }`}
            >
              {service.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSubNav;
