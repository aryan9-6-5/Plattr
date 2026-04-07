const mealTypeConfig: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
  TIFFIN:    { label: "Tiffin",    emoji: "🍱", bg: "bg-blue-100",  text: "text-blue-700" },
  BULK:      { label: "Bulk",      emoji: "📦", bg: "bg-purple-100",text: "text-purple-700" },
  EVENT:     { label: "Event",     emoji: "🎉", bg: "bg-pink-100",  text: "text-pink-700" },
  ALA_CARTE: { label: "À La Carte",emoji: "🍽", bg: "bg-[#EEF8F1]",text: "text-[#2D6A4F]" },
};

const MealTypeBadge = ({ meal_type }: { meal_type?: string | null }) => {
  if (!meal_type) return null;
  const cfg = mealTypeConfig[meal_type] ?? { label: meal_type, emoji: "🍽", bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.emoji} {cfg.label}
    </span>
  );
};

export default MealTypeBadge;
