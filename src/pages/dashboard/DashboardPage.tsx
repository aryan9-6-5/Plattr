import { Link } from "react-router-dom";
import { Package, RefreshCw, User, ArrowRight, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { formatRupees } from "@/utils/formatCurrency";
import { motion } from "framer-motion";

const Stat = ({ label, value, icon: Icon, delay = 0 }: { label: string; value: string | number; icon: React.ElementType; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
    className="bg-white rounded-[32px] p-8 border border-[#E5E1D8] flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-500 group"
  >
    <div className="w-16 h-16 rounded-2xl bg-[#1B4332] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-3xl font-serif font-bold text-[#1B2D24] mb-1 leading-none">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A9A88]">{label}</p>
    </div>
  </motion.div>
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
    <div className="space-y-12 pb-24">
      {/* Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E5E1D8] pb-10"
      >
        <div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#1B2D24] tracking-tight leading-none">
            Welcome back, <br /><span className="italic italic-font-serif text-[#1B4332]">{profile?.full_name?.split(" ")[0] ?? "Artisan"}</span>
          </h1>
        </div>
        <div className="text-left md:text-right">
           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mb-1">Electronic ID</p>
           <p className="text-sm text-[#1B2D24] font-sans">{user?.email}</p>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Stat label="Total Shipments" value={orders.length} icon={Package} delay={0.1} />
        <Stat label="Active Pipelines" value={activeSubs} icon={RefreshCw} delay={0.2} />
        <Stat label="Total Investment" value={formatRupees(totalSpend)} icon={TrendingUp} delay={0.3} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[11px] font-black text-[#1B2D24] uppercase tracking-[0.3em] flex items-center gap-3">
               <Clock size={16} /> Recent Logbook
            </h2>
            <Link to="/dashboard/orders" className="text-[10px] font-black text-[#1B4332] uppercase tracking-[0.2em] hover:underline flex items-center gap-2 group">
              Audit All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-[40px] border border-[#E5E1D8] overflow-hidden shadow-sm"
          >
            {recentOrders.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-[#FDFCF8] rounded-full flex items-center justify-center mx-auto mb-6">
                   <Package className="w-8 h-8 text-[#E5E1D8]" />
                </div>
                <p className="font-serif text-xl text-[#7A9A88] italic">The logbook is currently void.</p>
                <Link to="/catalog" className="inline-flex mt-10 px-8 py-4 rounded-xl bg-[#1B4332] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#2D6A4F] transition-all">
                  Initiate Order
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E5E1D8] bg-[#FDFCF8]">
                      {["ID", "Date", "Value", "Status", ""].map((h) => (
                        <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A9A88]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1D8]">
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FDFCF8] transition-all group">
                        <td className="px-8 py-6 font-mono text-[11px] text-[#7A9A88]">{o.order_number ?? o.id.slice(0, 8)}</td>
                        <td className="px-8 py-6 text-sm text-[#4A6357] font-sans">{formatDate(o.created_at)}</td>
                        <td className="px-8 py-6 font-bold text-[#1B2D24] font-sans">{formatRupees(o.total_amount)}</td>
                        <td className="px-8 py-6"><StatusBadge status={o.status} /></td>
                        <td className="px-8 py-6 pr-10 text-right">
                          <Link
                            to={`/dashboard/orders/${o.id}`}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]
                                       opacity-0 group-hover:opacity-100 transition-all hover:underline"
                          >
                            Details <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Quick Actions */}
        <div className="space-y-10">
          <h2 className="text-[11px] font-black text-[#1B2D24] uppercase tracking-[0.3em] flex items-center gap-3">
             <TrendingUp size={16} /> Rapid Deployment
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {[
              { to: "/catalog",               icon: Package,   label: "Acquire Supply",      desc: "Browse the curated network" },
              { to: "/dashboard/subscriptions", icon: RefreshCw, label: "Manage Pipelines",  desc: "Audit your recurring plans" },
              { to: "/dashboard/profile",      icon: User,      label: "Update Profile",        desc: "Modify electronic identity" },
            ].map(({ to, icon: Icon, label, desc }, idx) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + (idx * 0.1) }}
              >
                <Link to={to}
                  className="flex items-center gap-6 bg-white rounded-[30px] p-8 border border-[#E5E1D8] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B4332] group-hover:border-transparent transition-all duration-500">
                    <Icon className="w-6 h-6 text-[#1B4332] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1B2D24] group-hover:text-[#1B4332] transition-colors">{label}</p>
                    <p className="text-[10px] text-[#7A9A88] font-black uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-all">{desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Editorial Promotion Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="bg-[#1B4332] rounded-[40px] p-10 relative overflow-hidden shadow-2xl group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
              <TrendingUp size={120} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4 relative z-10">The Artisan Expansion.</h3>
            <p className="text-sm text-[#D8F3DC]/60 font-sans leading-relaxed mb-8 relative z-10">We've added 5 new heritage specialists in your sector. Audit the new pipeline.</p>
            <Link to="/chefs" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#D8F3DC] border-b border-[#D8F3DC]/30 pb-1 hover:border-[#D8F3DC] transition-all">
              Meet Artisans <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
