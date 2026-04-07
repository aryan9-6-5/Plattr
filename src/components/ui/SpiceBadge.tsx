const spiceConfig: Record<string, { label: string; emoji: string }> = {
  MILD:       { label: "Mild",       emoji: "🌿" },
  MEDIUM:     { label: "Medium",     emoji: "🌶" },
  HOT:        { label: "Hot",        emoji: "🌶🌶" },
  EXTRA_HOT:  { label: "Extra Hot",  emoji: "🌶🌶🌶" },
};

const SpiceBadge = ({ spice_level }: { spice_level?: string | null }) => {
  if (!spice_level) return null;
  const cfg = spiceConfig[spice_level] ?? { label: spice_level, emoji: "🌶" };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF3E0] text-[#E65100]">
      {cfg.emoji} {cfg.label}
    </span>
  );
};

export default SpiceBadge;
