import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Chef } from "./useChefs";

export const useChef = (id: string | undefined) => {
  const [chef, setChef] = useState<Chef | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("chefs")
          .select("*")
          .eq("id", id)
          .single();
        if (err) throw err;
        setChef(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load chef");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { chef, loading, error };
};
