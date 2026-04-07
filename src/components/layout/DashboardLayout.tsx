import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutGrid, Package, RefreshCw, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const sidebarLinks = [
  { href: "/dashboard",                 icon: LayoutGrid, label: "Overview" },
  { href: "/dashboard/orders",          icon: Package,    label: "My Orders" },
  { href: "/dashboard/subscriptions",   icon: RefreshCw,  label: "Subscriptions" },
  { href: "/dashboard/profile",         icon: User,       label: "Profile" },
];

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E8F5EC] flex-col p-6">
        {/* User info */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#E8F5EC]">
          <div className="w-10 h-10 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {profile?.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1B2D24] truncate">
              {profile?.full_name ?? "My Account"}
            </p>
            <p className="text-xs text-[#7A9A88] truncate">{user?.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#EEF8F1] text-[#2D6A4F] font-semibold"
                    : "text-[#4A6357] hover:bg-[#F6FFF8] hover:text-[#2D6A4F]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#7A9A88] hover:bg-[#FFEBEE] hover:text-[#D32F2F] transition-colors w-full mt-4"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F6FFF8] p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
