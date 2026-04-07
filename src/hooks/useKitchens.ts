import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Kitchen = {
  id: string;
  name: string;
  description?: string;
  city?: string;
  address?: string;
  capacity_per_day?: number;
  rating?: number;
  is_active?: boolean;
  contact_phone?: string;
  contact_email?: string;
};

export const useKitchens = () => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("kitchens")
          .select("*")
          .order("name");
        if (err) throw err;
        setKitchens(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load kitchens");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { kitchens, loading, error };
};
