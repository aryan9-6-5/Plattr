import { ChefHat, Building2, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

const sourceConfig: Record<string, { label: string; Icon: typeof ChefHat }> = {
  HOME_CHEF:     { label: "Home Chef",     Icon: ChefHat },
  CLOUD_KITCHEN: { label: "Cloud Kitchen", Icon: Building2 },
  RESTAURANT:    { label: "Restaurant",    Icon: UtensilsCrossed },
};

type SourceBadgeProps = {
  source_type: string;
  source_name?: string;
  source_link?: string;
};

const SourceBadge = ({ source_type, source_name, source_link }: SourceBadgeProps) => {
  const cfg = sourceConfig[source_type];
  if (!cfg) return null;
  const Icon = cfg.Icon;

  const content = (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF8F1] border border-[#D4E8DA] text-sm font-medium text-[#2D6A4F] hover:bg-[#D8F3DC] transition-colors">
      <Icon className="w-3.5 h-3.5" />
      {source_name ? `By ${source_name}` : cfg.label}
    </span>
  );

  return source_link ? <Link to={source_link}>{content}</Link> : content;
};

export default SourceBadge;
