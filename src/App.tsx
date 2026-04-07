import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

// Layout
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import DishDetailPage from "./pages/DishDetailPage";
import ChefsPage from "./pages/ChefsPage";
import ChefProfilePage from "./pages/ChefProfilePage";
import KitchensPage from "./pages/KitchensPage";
import KitchenDetailPage from "./pages/KitchenDetailPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ForBusinessPage from "./pages/ForBusinessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import BlogComingSoonPage from "./pages/BlogComingSoonPage";

// Dashboard pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import OrderDetailPage from "./pages/dashboard/OrderDetailPage";
import SubscriptionsPage from "./pages/dashboard/SubscriptionsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing page (standalone, no shared layout) */}
                <Route path="/" element={<Index />} />

                {/* All public pages share Layout (Navbar + Footer) */}
                <Route element={<Layout />}>
                  {/* Catalog */}
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/menu" element={<Navigate to="/catalog" replace />} />
                  <Route path="/catalog/:cuisineSlug" element={<CatalogPage />} />
                  <Route path="/dish/:id" element={<DishDetailPage />} />

                  {/* Chefs */}
                  <Route path="/chefs" element={<ChefsPage />} />
                  <Route path="/chefs/:id" element={<ChefProfilePage />} />

                  {/* Kitchens */}
                  <Route path="/kitchens" element={<KitchensPage />} />
                  <Route path="/kitchens/:id" element={<KitchenDetailPage />} />

                  {/* Restaurants */}
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

                  {/* Content */}
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/for-business" element={<ForBusinessPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/blog" element={<BlogComingSoonPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Checkout + Order flow */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

                  {/* Protected Dashboard routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/dashboard/orders" element={<OrdersPage />} />
                      <Route path="/dashboard/orders/:id" element={<OrderDetailPage />} />
                      <Route path="/dashboard/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="/dashboard/profile" element={<ProfilePage />} />
                    </Route>
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
