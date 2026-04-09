import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

// Layout
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Lazy Pages
const Index = lazy(() => import("./pages/Index"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const MealBoxBuilderPage = lazy(() => import("./pages/MealBoxBuilderPage"));
const SnackBoxesPage = lazy(() => import("./pages/SnackBoxesPage"));
const CombosPage = lazy(() => import("./pages/CombosPage"));
const DishDetailPage = lazy(() => import("./pages/DishDetailPage"));
const ChefsPage = lazy(() => import("./pages/ChefsPage"));
const ChefProfilePage = lazy(() => import("./pages/ChefProfilePage"));
const KitchensPage = lazy(() => import("./pages/KitchensPage"));
const KitchenDetailPage = lazy(() => import("./pages/KitchenDetailPage"));
const RestaurantsPage = lazy(() => import("./pages/RestaurantsPage"));
const RestaurantDetailPage = lazy(() => import("./pages/RestaurantDetailPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ForBusinessPage = lazy(() => import("./pages/ForBusinessPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const BlogComingSoonPage = lazy(() => import("./pages/BlogComingSoonPage"));
const HealthCheck = lazy(() => import("./pages/HealthCheck"));

// Lazy Dashboard pages
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const OrdersPage = lazy(() => import("./pages/dashboard/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/dashboard/OrderDetailPage"));
const SubscriptionsPage = lazy(() => import("./pages/dashboard/SubscriptionsPage"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage"));

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
              <ScrollToTop />
              <Suspense fallback={
                <div className="flex h-screen w-full items-center justify-center bg-[#F6FFF8]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
                </div>
              }>
                <Routes>
                  {/* Standalone pages (no shared layout) */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* All public pages share Layout (Navbar + Footer) */}
                  <Route element={<Layout />}>
                    {/* Catalog */}
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/menu" element={<Navigate to="/catalog" replace />} />
                    <Route path="/catalog/:cuisineSlug" element={<CatalogPage />} />
                    
                    {/* Specialized Pipelines */}
                    <Route path="/mealbox-builder" element={<MealBoxBuilderPage />} />
                    <Route path="/snack-boxes" element={<SnackBoxesPage />} />
                    <Route path="/combos" element={<CombosPage />} />
                    
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

                    {/* (Auth routes moved above Layout wrapper) */}

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

                    {/* Health Monitor */}
                    <Route path="/health" element={<HealthCheck />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
