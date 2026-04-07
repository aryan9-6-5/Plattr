import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Kitchen } from "./useKitchens";

export const useKitchen = (id: string | undefined) => {
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("kitchens")
          .select("*")
          .eq("id", id)
          .single();
        if (err) throw err;
        setKitchen(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load kitchen");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { kitchen, loading, error };
};
