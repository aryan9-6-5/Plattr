import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Review = {
  id: string;
  target_type: string;
  target_id: string;
  rating: number;
  comment?: string;
  reviewer_id?: string;
  is_verified_purchase?: boolean;
  created_at?: string;
};

export const useReviews = (
  targetType: string | undefined,
  targetId: string | undefined
) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetType || !targetId) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("reviews")
          .select("*")
          .eq("target_type", targetType)
          .eq("target_id", targetId)
          .order("created_at", { ascending: false });
        if (err) throw err;
        setReviews(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [targetType, targetId]);

  return { reviews, loading, error };
};
