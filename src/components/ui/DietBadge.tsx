const dietConfig: Record<string, { label: string; bg: string; text: string }> = {
  VEG:     { label: "Veg",     bg: "bg-green-100",  text: "text-green-700" },
  NON_VEG: { label: "Non-Veg", bg: "bg-red-100",    text: "text-red-700" },
  EGG:     { label: "Egg",     bg: "bg-yellow-100", text: "text-yellow-700" },
  VEGAN:   { label: "Vegan",   bg: "bg-emerald-100",text: "text-emerald-700" },
  JAIN:    { label: "Jain",    bg: "bg-orange-100", text: "text-orange-700" },
};

const DietBadge = ({ diet_type }: { diet_type?: string | null }) => {
  if (!diet_type) return null;
  const cfg = dietConfig[diet_type] ?? { label: diet_type, bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

export default DietBadge;
