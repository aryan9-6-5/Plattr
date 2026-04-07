import { Link } from "react-router-dom";
import { Package, RefreshCw, User, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { formatRupees } from "@/utils/formatCurrency";

const Stat = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Package }) => (
  <div className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-[#EEF8F1] flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-[#2D6A4F]" />
    </div>
    <div>
      <p className="text-2xl font-bold font-serif text-[#1B2D24]">{value}</p>
      <p className="text-xs text-[#7A9A88]">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { orders } = useOrders();
  const { subscriptions } = useSubscriptions();

  const recentOrders = orders.slice(0, 5);
  const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const totalSpend = orders.reduce((s, o) => s + (o.total_amount ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1B2D24]">
          Good day, {profile?.full_name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-sm text-[#7A9A88] mt-1">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Total Orders" value={orders.length} icon={Package} />
        <Stat label="Active Subscriptions" value={activeSubs} icon={RefreshCw} />
        <Stat label="Total Spend" value={formatRupees(totalSpend)} icon={User} />
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1B2D24] uppercase tracking-wider">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-xs text-[#2D6A4F] font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-8 text-center">
            <Package className="w-8 h-8 text-[#D4E8DA] mx-auto mb-3" />
            <p className="text-sm text-[#7A9A88]">No orders yet</p>
            <Link to="/catalog" className="inline-flex mt-4 items-center gap-1 text-sm font-semibold text-[#2D6A4F] hover:underline">
              Browse the catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8F5EC]">
                  {["Order #", "Date", "Amount", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#7A9A88]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6FFF8]">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F6FFF8] transition-colors group">
                    <td className="px-5 py-4 font-mono text-xs text-[#4A6357]">{o.order_number ?? o.id.slice(0, 8)}</td>
                    <td className="px-5 py-4 text-[#4A6357]">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-4 font-semibold text-[#1B2D24]">{formatRupees(o.total_amount)}</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F]
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:underline"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold text-[#1B2D24] uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: "/catalog",               icon: Package,   label: "Browse Catalog",      desc: "Find new dishes to order" },
            { to: "/dashboard/subscriptions", icon: RefreshCw, label: "My Subscriptions",  desc: "Manage your tiffin plans" },
            { to: "/dashboard/profile",      icon: User,      label: "Edit Profile",        desc: "Update your info & address" },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to}
              className="flex items-center gap-4 bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EEF8F1] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1B2D24] group-hover:text-[#2D6A4F] transition-colors">{label}</p>
                <p className="text-xs text-[#7A9A88] truncate">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
