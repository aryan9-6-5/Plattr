import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Restaurant } from "./useRestaurants";

export const useRestaurant = (id: string | undefined) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", id)
          .single();
        if (err) throw err;
        setRestaurant(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { restaurant, loading, error };
};
