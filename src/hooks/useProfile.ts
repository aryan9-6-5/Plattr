import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

export type Profile = {
  id: string;
  full_name?: string;
  phone?: string;
  city?: string;
  pincode?: string;
  role?: string;
  avatar_url?: string;
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (err) throw err;
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return { profile, loading, error };
};
