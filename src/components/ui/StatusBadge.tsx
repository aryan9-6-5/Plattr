const orderStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:          { label: "Pending",         bg: "bg-yellow-100", text: "text-yellow-700" },
  CONFIRMED:        { label: "Confirmed",        bg: "bg-blue-100",   text: "text-blue-700" },
  PREPARING:        { label: "Preparing",        bg: "bg-orange-100", text: "text-orange-700" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", bg: "bg-purple-100", text: "text-purple-700" },
  DELIVERED:        { label: "Delivered",        bg: "bg-[#D8F3DC]",  text: "text-[#1B4332]" },
  CANCELLED:        { label: "Cancelled",        bg: "bg-[#FFEBEE]",  text: "text-[#7F0000]" },
  REFUNDED:         { label: "Refunded",         bg: "bg-gray-100",   text: "text-gray-600" },
};

const subscriptionStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  ACTIVE:    { label: "Active",    bg: "bg-[#D8F3DC]", text: "text-[#1B4332]" },
  PAUSED:    { label: "Paused",    bg: "bg-yellow-100",text: "text-yellow-700" },
  CANCELLED: { label: "Cancelled", bg: "bg-[#FFEBEE]", text: "text-[#7F0000]" },
  EXPIRED:   { label: "Expired",   bg: "bg-gray-100",  text: "text-gray-600" },
};

type StatusBadgeProps = {
  status?: string | null;
  type?: "order" | "subscription" | "kitchen";
};

const StatusBadge = ({ status, type = "order" }: StatusBadgeProps) => {
  if (!status) return null;
  const config = type === "subscription" ? subscriptionStatusConfig : orderStatusConfig;
  const cfg = config[status] ?? { label: status, bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
