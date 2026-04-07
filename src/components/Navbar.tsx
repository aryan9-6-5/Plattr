import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut, User, Package, RefreshCw, LayoutGrid } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CartButton from "@/components/cart/CartButton";

const navLinks = [
  { label: "Explore Food",   href: "/catalog" },
  { label: "Our Chefs",      href: "/chefs" },
  { label: "For Business",   href: "/for-business" },
  { label: "How It Works",   href: "/how-it-works" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLanding = pathname === "/";

  return (
    <>
      <nav
        className={`sticky top-0 z-50 h-16 border-b transition-colors duration-300 ${
          isLanding
            ? "bg-[#F6FFF8]/95 border-[#D4E8DA]/50"
            : "bg-white/95 border-[#E8F5EC]"
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full">
            <img src="/logo.png" alt="Plattr" className="h-8 sm:h-10 w-auto object-contain" />
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 pb-0.5 ${
                    active
                      ? "text-[#2D6A4F] font-semibold border-b-2 border-[#2D6A4F]"
                      : "text-[#4A6357] hover:text-[#2D6A4F]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart button — always visible */}
            <CartButton />

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-[#4A6357] hover:text-[#2D6A4F] transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex px-4 py-2 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <button className="p-2 rounded-full text-[#7A9A88] hover:bg-[#EEF8F1] transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white text-sm font-bold flex items-center justify-center hover:bg-[#1B4332] transition-colors"
                  >
                    {user.email?.[0].toUpperCase() ?? "U"}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-[#E8F5EC] py-2 z-50"
                      >
                        {[
                          { href: "/dashboard",               icon: LayoutGrid, label: "My Dashboard" },
                          { href: "/dashboard/orders",         icon: Package,    label: "My Orders" },
                          { href: "/dashboard/subscriptions",  icon: RefreshCw,  label: "Subscriptions" },
                          { href: "/dashboard/profile",        icon: User,       label: "Profile" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            to={href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A6357] hover:bg-[#EEF8F1] hover:text-[#2D6A4F] transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                        <div className="border-t border-[#E8F5EC] my-1" />
                        <button
                          onClick={() => { signOut(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D32F2F] hover:bg-[#FFEBEE] w-full transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full text-[#4A6357] hover:bg-[#EEF8F1] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 w-72 h-full bg-white z-50 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E8F5EC]">
                <img src="/logo.png" alt="Plattr" className="h-8 w-auto object-contain" />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-[#EEF8F1]">
                  <X className="w-5 h-5 text-[#4A6357]" />
                </button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex px-5 py-3 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-[#2D6A4F] bg-[#EEF8F1]"
                        : "text-[#4A6357] hover:bg-[#F6FFF8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="p-5 border-t border-[#E8F5EC] flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-full border border-[#D4E8DA] text-sm font-semibold text-[#2D6A4F]">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold">Get Started</Link>
                  </>
                ) : (
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-center py-2.5 rounded-full border border-[#FFEBEE] text-sm font-semibold text-[#D32F2F]">Sign Out</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
