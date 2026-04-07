import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Chef = {
  id: string;
  name: string;
  region: string;
  city?: string;
  specialty?: string;
  bio?: string;
  rating?: number;
  total_reviews?: number;
  is_verified?: boolean;
  is_available?: boolean;
  years_exp?: number;
  profile_id?: string;
};

export type ChefFilters = {
  city?: string;
  is_available?: boolean;
  is_verified?: boolean;
};

export const useChefs = (filters: ChefFilters = {}) => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("chefs")
          .select("*")
          .order("rating", { ascending: false });

        if (filters.city) query = query.eq("city", filters.city);
        if (filters.is_available !== undefined)
          query = query.eq("is_available", filters.is_available);
        if (filters.is_verified !== undefined)
          query = query.eq("is_verified", filters.is_verified);

        const { data, error: err } = await query;
        if (err) throw err;
        setChefs(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load chefs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters.city, filters.is_available, filters.is_verified]);

  return { chefs, loading, error };
};
