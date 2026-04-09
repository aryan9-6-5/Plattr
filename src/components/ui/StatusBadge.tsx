const orderStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:          { label: "Pending",         bg: "bg-[#EEF8F1]", text: "text-[#7A9A88]" },
  CONFIRMED:        { label: "Confirmed",        bg: "bg-[#1B4332]/10",   text: "text-[#1B4332]" },
  PREPARING:        { label: "In Prep",        bg: "bg-[#1B4332]/10", text: "text-[#1B4332]" },
  OUT_FOR_DELIVERY: { label: "Deployment", bg: "bg-[#1B4332]", text: "text-white" },
  DELIVERED:        { label: "Delivered",        bg: "bg-[#D8F3DC]",  text: "text-[#1B4332]" },
  CANCELLED:        { label: "Voided",        bg: "bg-red-50",  text: "text-red-700" },
  REFUNDED:         { label: "Refunded",         bg: "bg-gray-50",   text: "text-gray-500" },
};

const subscriptionStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  ACTIVE:    { label: "Active",    bg: "bg-[#1B4332]", text: "text-white" },
  PAUSED:    { label: "Paused",    bg: "bg-[#EEF8F1]",text: "text-[#7A9A88]" },
  CANCELLED: { label: "Voided", bg: "bg-red-50", text: "text-red-700" },
  EXPIRED:   { label: "Expired",   bg: "bg-gray-50",  text: "text-gray-500" },
};

type StatusBadgeProps = {
  status?: string | null;
  type?: "order" | "subscription" | "kitchen";
};

const StatusBadge = ({ status, type = "order" }: StatusBadgeProps) => {
  if (!status) return null;
  const config = type === "subscription" ? subscriptionStatusConfig : orderStatusConfig;
  const cfg = config[status] ?? { label: status, bg: "bg-gray-50", text: "text-gray-500" };
  
  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${cfg.bg} ${cfg.text} border border-transparent shadow-sm whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
