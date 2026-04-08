import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import BackToTop from "@/components/ui/BackToTop";

const Layout = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FFF8]">
      <Navbar />
      <div className="h-16 sm:h-20 shrink-0" /> {/* Navbar Clearance */}
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Layout;
