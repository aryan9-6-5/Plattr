import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

export type Subscription = {
  id: string;
  customer_id?: string;
  plan?: string;
  status?: string;
  meal_type?: string;
  start_date?: string;
  end_date?: string;
  price_per_meal?: number;
  meals_per_day?: number;
  delivery_address?: string;
  preferred_dishes?: string[];
};

export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("customer_id", user.id)
          .order("start_date", { ascending: false });
        if (err) throw err;
        setSubscriptions(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return { subscriptions, loading, error };
};
