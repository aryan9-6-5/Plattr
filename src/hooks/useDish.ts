import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Dish } from "./useDishes";

export const useDish = (id: string | undefined) => {
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("dishes")
          .select("*")
          .eq("id", id)
          .single();
        if (err) throw err;
        setDish(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dish");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { dish, loading, error };
};
