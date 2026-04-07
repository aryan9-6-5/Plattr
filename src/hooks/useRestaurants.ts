import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Restaurant = {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  city?: string;
  address?: string;
  cuisine_region?: string;
  rating?: number;
  is_partner?: boolean;
  contact_phone?: string;
  fssai_license?: string;
};

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("restaurants")
          .select("*")
          .eq("is_partner", true)
          .order("name");
        if (err) throw err;
        setRestaurants(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { restaurants, loading, error };
};
