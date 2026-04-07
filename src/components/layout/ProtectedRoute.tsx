import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/ui/PageLoader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
