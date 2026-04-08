import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut, User, Package, RefreshCw, LayoutGrid, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CartButton from "@/components/cart/CartButton";

const navLinks = [
  { label: "Features",       href: "/#features", scrollTo: "features" },
  { label: "Explore Food",   href: "/catalog" },
  { label: "Our Chefs",      href: "/chefs" },
  { label: "How It Works",   href: "/how-it-works" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div 
        className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)] ${
          visible ? 'translate-y-0' : '-translate-y-32'
        } ${scrolled ? 'top-6 px-4' : 'top-0 px-0'}`}
      >
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            pointer-events-auto
            h-16 sm:h-20
            flex items-center justify-between
            px-6 sm:px-10
            [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)]
            ${scrolled 
              ? "w-full max-w-5xl rounded-full bg-[#1B2D24]/80 backdrop-blur-2xl border-white/5 shadow-2xl scale-[0.98] border" 
              : "w-full max-w-none rounded-none bg-white/95 backdrop-blur-md border-b border-[#E8F5EC] shadow-sm"
            }
          `}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Plattr" 
              className={`h-7 sm:h-9 w-auto [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'brightness-0 invert' : ''}`} 
            />
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[13px] font-bold tracking-wider uppercase [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)] ${
                    scrolled 
                      ? (active ? 'text-[#52B788]' : 'text-white/60 hover:text-white')
                      : (active ? 'text-[#2D6A4F]' : 'text-[#4A6357] hover:text-[#2D6A4F]')
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <div className={`hidden sm:block ${scrolled ? 'text-white' : 'text-[#1B2D24]'}`}>
              <CartButton scrolled={scrolled} />
            </div>

            {!user ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <Link
                  to="/login"
                  className={`hidden md:block text-[13px] font-bold tracking-wider uppercase transition-colors ${
                    scrolled ? 'text-white/80 hover:text-white' : 'text-[#4A6357] hover:text-[#2D6A4F]'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`
                    flex items-center gap-2
                    px-5 sm:px-7 py-2.5 sm:py-3 
                    rounded-full text-[12px] font-black tracking-widest uppercase
                    transition-all duration-300
                    ${scrolled 
                      ? "bg-[#52B788] text-white hover:bg-[#40916C] shadow-lg shadow-[#52B788]/20" 
                      : "bg-[#1B2D24] text-white hover:bg-[#2D6A4F] shadow-xl shadow-[#1B2D24]/10"
                    }
                  `}
                >
                  Get Started <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => { setNotificationsOpen(!notificationsOpen); setDropdownOpen(false); }}
                    className={`p-2.5 rounded-full transition-colors ${
                      scrolled 
                        ? (notificationsOpen ? 'bg-white/10 text-[#52B788]' : 'text-white hover:bg-white/5')
                        : (notificationsOpen ? 'bg-[#EEF8F1] text-[#2D6A4F]' : 'text-[#4A6357] hover:bg-[#EEF8F1]')
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  {/* Notifications Dropdown stays mostly same but matches style */}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => { setDropdownOpen(!dropdownOpen); setNotificationsOpen(false); }}
                    className={`
                      w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all
                      ${scrolled 
                        ? 'bg-[#52B788] text-white border-2 border-white/10' 
                        : 'bg-[#1B2D24] text-white'
                      }
                    `}
                  >
                    {user.email?.[0].toUpperCase() ?? "U"}
                  </button>
                  
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className={`absolute right-0 top-14 w-56 rounded-3xl shadow-2xl border p-2 z-50 ${
                          scrolled ? 'bg-[#1B2D24] border-white/5' : 'bg-white border-[#E8F5EC]'
                        }`}
                      >
                        {[
                          { href: "/dashboard",               icon: LayoutGrid, label: "Dashboard" },
                          { href: "/dashboard/orders",         icon: Package,    label: "Orders" },
                          { href: "/dashboard/profile",        icon: User,       label: "Profile Settings" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            to={href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-[13px] font-semibold rounded-2xl transition-colors ${
                              scrolled 
                                ? 'text-white/70 hover:bg-white/5 hover:text-white' 
                                : 'text-[#4A6357] hover:bg-[#EEF8F1] hover:text-[#2D6A4F]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                        <div className={`h-px my-1 ${scrolled ? 'bg-white/5' : 'bg-[#E8F5EC]'}`} />
                        <button
                          onClick={() => signOut()}
                          className={`flex items-center gap-3 px-4 py-3 text-[13px] font-bold rounded-2xl w-full transition-colors text-[#D32F2F] hover:bg-red-50/5`}
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                scrolled ? 'text-white/70 hover:bg-white/5' : 'text-[#4A6357] hover:bg-[#EEF8F1]'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile drawer stays consistent but gets premium font and spacing */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#0F2318]/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-[70] flex flex-col shadow-2xl lg:hidden p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <img src="/logo.png" alt="Plattr" className="h-8 w-auto" />
                <button onClick={() => setMobileOpen(false)} className="p-3 rounded-full bg-[#EEF8F1] text-[#2D6A4F]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-serif font-bold text-[#1B2D24] hover:text-[#52B788] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t border-[#EEF8F1] flex flex-col gap-4">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center text-lg font-bold text-[#4A6357]">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full py-5 text-center bg-[#1B2D24] text-white rounded-3xl text-lg font-bold shadow-xl">Get Started</Link>
                  </>
                ) : (
                  <button onClick={() => signOut()} className="w-full py-5 text-center border-2 border-[#FFEBEE] text-[#D32F2F] rounded-3xl text-lg font-bold">Sign Out</button>
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
