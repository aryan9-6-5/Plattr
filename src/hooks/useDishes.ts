import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Dish = {
  id: string;
  name: string;
  cuisine: string;
  meal_type: string;
  source_type: string;
  source_id: string;
  price: number;
  bulk_price?: number;
  min_bulk_qty?: number;
  is_spicy: boolean;
  diet_type?: string;
  spice_level?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  is_available: boolean;
  created_at: string;
};

export type DishFilters = {
  cuisine?: string;
  meal_type?: string;
  diet_type?: string;
  source_type?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export const useDishes = (filters: DishFilters = {}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("dishes")
          .select("*", { count: "exact" })
          .eq("is_available", true)
          .order("created_at", { ascending: false });

        if (filters.cuisine) query = query.eq("cuisine", filters.cuisine);
        if (filters.meal_type) query = query.eq("meal_type", filters.meal_type);
        if (filters.diet_type) query = query.eq("diet_type", filters.diet_type);
        if (filters.source_type) query = query.eq("source_type", filters.source_type);
        if (filters.search) query = query.ilike("name", `%${filters.search}%`);

        const pageSize = filters.limit ?? 50;
        const offset = filters.offset ?? 0;
        query = query.range(offset, offset + pageSize - 1);

        const { data, error: err, count } = await query;
        if (err) throw err;
        setDishes(data || []);
        setTotal(count ?? 0);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [
    filters.cuisine,
    filters.meal_type,
    filters.diet_type,
    filters.source_type,
    filters.search,
    filters.limit,
    filters.offset,
  ]);

  return { dishes, loading, error, total };
};
