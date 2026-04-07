import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-[#EEF8F1] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[#52B788]" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-[#1B2D24] mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-[#7A9A88] max-w-xs mb-6">{description}</p>
    )}
    {actionLabel && (actionHref ? (
      <Link
        to={actionHref}
        className="px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-colors"
      >
        {actionLabel}
      </Link>
    ) : onAction ? (
      <button
        onClick={onAction}
        className="px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-colors"
      >
        {actionLabel}
      </button>
    ) : null)}
  </div>
);

export default EmptyState;
