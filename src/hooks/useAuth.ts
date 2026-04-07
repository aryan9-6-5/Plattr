import { useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const { user, session, loading, signOut } = useAuthContext();
  return { user, session, loading, signOut };
};
