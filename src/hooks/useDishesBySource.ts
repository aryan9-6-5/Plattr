import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Dish } from "./useDishes";

export const useDishesBySource = (
  sourceType: string | undefined,
  sourceId: string | undefined
) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceType || !sourceId) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("dishes")
          .select("*")
          .eq("source_type", sourceType)
          .eq("source_id", sourceId)
          .eq("is_available", true)
          .order("created_at", { ascending: false });
        if (err) throw err;
        setDishes(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sourceType, sourceId]);

  return { dishes, loading, error };
};
