import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut, User, Package, RefreshCw, LayoutGrid, ArrowRight, MapPin, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CartButton from "@/components/cart/CartButton";
import { lockScroll, unlockScroll } from "@/utils/scrollLock";

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
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem("plattr_location") || "Select Location";
  });
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if background should be scrolled
      setScrolled(currentScrollY > 60);

      // Peek-a-boo logic: hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setShow(false); // scrolling down
      } else {
        setShow(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu or notifications drawer is open
  useEffect(() => {
    if (mobileOpen || notificationsOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => { unlockScroll(); };
  }, [mobileOpen, notificationsOpen]);

  // Clean up on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  return (
    <>
      <div 
        className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none [transition:all_600ms_cubic-bezier(0.4,0,0.2,1)] top-0 ${
          scrolled ? 'px-4 sm:px-6 pt-3' : 'px-0 pt-0'
        } ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`
            pointer-events-auto relative
            h-16
            ${scrolled 
              ? "w-full max-w-5xl px-4 sm:px-6 flex items-center justify-between gap-2 bg-[#1B4332]/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(27,67,50,0.35)] rounded-full border border-white/10" 
              : "w-full px-4 sm:px-6 md:px-10 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-2 bg-[#F6FFF8]/95 backdrop-blur-md border-b border-[#D4E8DA] shadow-sm"
            }
            [transition:all_600ms_cubic-bezier(0.4,0,0.2,1)]
          `}
        >
          <div className="flex items-center gap-4 xl:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 min-w-0">
              <img 
                src="/logo.png" 
                alt="Plattr" 
                className={`h-7 md:h-9 w-auto [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'brightness-0 invert' : 'invert-0'}`} 
              />
            </Link>
          </div>

          {/* Center nav — desktop */}
          <div className={`hidden lg:flex items-center justify-self-center ${scrolled ? 'gap-3 xl:gap-6' : 'gap-5 xl:gap-8'}`}>
            {!scrolled && (
              <div className="relative">
                <button 
                  onClick={() => {
                    setLocationOpen(!locationOpen);
                    setDropdownOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity text-[#1B2D24] border-r border-[#D4E8DA] pr-6 mr-4"
                >
                  <MapPin strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5 text-[#2D6A4F]" />
                  <span className="text-[13px] md:text-[14px] font-bold tracking-tight whitespace-nowrap font-sans">
                    {selectedLocation}
                  </span>
                  <ChevronDown strokeWidth={2.5} className={`w-3.5 h-3.5 md:w-4 md:h-4 opacity-50 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {locationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-[#D4E8DA] p-2 z-50"
                    >
                      {["Hyderabad", "Bangalore", "Delhi"].map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedLocation(city);
                            localStorage.setItem("plattr_location", city);
                            setLocationOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-bold font-sans transition-colors ${
                            selectedLocation === city 
                              ? "bg-[#EEF8F1] text-[#1B4332]" 
                              : "text-[#4A6357] hover:bg-gray-50 hover:text-[#1B2D24]"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[11px] xl:text-[12px] font-black tracking-[0.15em] uppercase [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)] font-sans whitespace-nowrap ${
                    scrolled 
                      ? (active ? 'text-[#D8F3DC]' : 'text-white/60 hover:text-white')
                      : (active ? 'text-[#1B4332]' : 'text-[#7A9A88] hover:text-[#1B4332]')
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 justify-self-end">
            <div className={`${scrolled ? 'text-white' : 'text-[#1B2D24]'}`}>
              <CartButton scrolled={scrolled} />
            </div>

            {!user ? (
              <div className="flex items-center gap-3 sm:gap-5">
                <Link
                  to="/login"
                  className={`hidden md:block text-[12px] font-black tracking-[0.15em] uppercase transition-colors font-sans ${
                    scrolled ? 'text-white/80 hover:text-white' : 'text-[#7A9A88] hover:text-[#1B4332]'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`
                    hidden sm:flex items-center gap-2
                    px-6 md:px-8 py-3 md:py-3.5
                    rounded-full text-[12px] font-black tracking-[0.15em] uppercase
                    transition-all duration-500 font-sans
                    ${scrolled 
                      ? "bg-white text-[#1B4332] hover:bg-[#D8F3DC] shadow-lg" 
                      : "bg-[#1B4332] text-white hover:bg-[#2D6A4F] shadow-xl"
                    }
                  `}
                >
                  Join Us <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setNotificationsOpen(true); setDropdownOpen(false); }}
                    className={`p-3 rounded-full transition-colors ${
                      scrolled 
                        ? (notificationsOpen ? 'bg-white/10 text-[#D8F3DC]' : 'text-white hover:bg-white/5')
                        : (notificationsOpen ? 'bg-[#EEF8F1] text-[#1B4332]' : 'text-[#7A9A88] hover:bg-[#EEF8F1]')
                    }`}
                  >
                    <Bell className="w-4.5 h-4.5" />
                  </button>
                
                  <button
                    onClick={() => { setDropdownOpen(!dropdownOpen); setNotificationsOpen(false); }}
                    className={`
                      w-11 h-11 rounded-full font-serif font-bold text-lg flex items-center justify-center transition-all
                      ${scrolled 
                        ? 'bg-[#2D6A4F] text-white border-2 border-white/20 shadow-lg' 
                        : 'bg-[#1B4332] text-white shadow-md'
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
                        className={`absolute right-0 top-16 w-60 rounded-[2rem] shadow-2xl border p-2.5 z-50 ${
                          scrolled ? 'bg-[#1B2D24] border-white/10' : 'bg-white border-[#D4E8DA]'
                        }`}
                      >
                        {[
                          { href: "/dashboard",               icon: LayoutGrid, label: "Studio Dashboard" },
                          { href: "/dashboard/orders",         icon: Package,    label: "Order History" },
                          { href: "/dashboard/profile",        icon: User,       label: "Member Profile" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            to={href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3.5 px-5 py-3.5 text-[13px] font-bold rounded-2xl transition-all duration-300 font-sans ${
                              scrolled 
                                ? 'text-white/70 hover:bg-white/5 hover:text-white' 
                                : 'text-[#4A6357] hover:bg-[#EEF8F1] hover:text-[#1B4332]'
                            }`}
                          >
                            <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                            {label}
                          </Link>
                        ))}
                        <div className={`h-px my-2 ${scrolled ? 'bg-white/5' : 'bg-[#D4E8DA]'}`} />
                        <button
                          onClick={() => signOut()}
                          className={`flex items-center gap-3.5 px-5 py-3.5 text-[13px] font-black rounded-2xl w-full transition-colors text-red-500 hover:bg-red-50/5 font-sans`}
                        >
                          <LogOut className="w-4.5 h-4.5" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2.5 rounded-full transition-colors ${
                scrolled ? 'text-white/70 hover:bg-white/5' : 'text-[#7A9A88] hover:bg-[#EEF8F1]'
              }`}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Notifications Drawer */}
      <>
        {/* Backdrop */}
        <div
          onClick={() => setNotificationsOpen(false)}
          className={`fixed inset-0 bg-[#0F2318]/40 backdrop-blur-md z-[9998] transition-opacity duration-500 ${
            notificationsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
        
        {/* Drawer */}
        <div
          className={`fixed right-0 top-0 bottom-0 z-[9999] w-full max-w-sm bg-[#F6FFF8] shadow-[0_0_80px_rgba(0,0,0,0.4)] flex flex-col transition-transform duration-500 ease-smooth ${
            notificationsOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-7 border-b border-[#D4E8DA] flex-shrink-0">
             <h2 className="font-serif text-2xl font-bold text-[#1B2D24]">Studio Feed</h2>
             <button onClick={() => setNotificationsOpen(false)} className="p-3 rounded-full hover:bg-[#EEF8F1] text-[#7A9A88] hover:text-[#1B4332] transition-colors">
               <X size={24} />
             </button>
          </div>
          
          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 rounded-full bg-[#EEF8F1] flex items-center justify-center mb-6">
                <Bell size={36} className="text-[#1B4332]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B2D24]">No New Updates</h3>
              <p className="text-sm text-[#4A6357] mt-4 leading-relaxed font-sans">
                You're all caught up. New curation updates and order logistics will appear in this feed.
              </p>
          </div>
        </div>
      </>

      {/* Mobile Menu Drawer */}
      <>
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-[#0F2318]/60 backdrop-blur-md z-[60] lg:hidden transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
        
        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 w-[90%] max-w-sm h-full bg-[#F6FFF8] z-[70] flex flex-col shadow-2xl lg:hidden p-10 transition-transform duration-500 ease-smooth ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
              <div className="flex items-center justify-between mb-16">
                <img src="/logo.png" alt="Plattr" className="h-9 w-auto" />
                <button onClick={() => setMobileOpen(false)} className="p-4 rounded-full bg-[#EEF8F1] text-[#1B4332]">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-serif font-bold text-[#1B2D24] hover:text-[#1B4332] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t border-[#D4E8DA] flex flex-col gap-5">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center text-lg font-bold text-[#7A9A88] font-sans">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full py-6 text-center bg-[#1B4332] text-white rounded-[2rem] text-lg font-bold shadow-2xl font-sans">Get Limited Access</Link>
                  </>
                ) : (
                  <button onClick={() => signOut()} className="w-full py-6 text-center border-2 border-red-100 text-red-500 rounded-[2rem] text-lg font-bold font-sans">Sign Out</button>
                )}
              </div>
        </div>
      </>
    </>
  );
};

export default Navbar;
