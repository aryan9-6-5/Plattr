import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

export type Order = {
  id: string;
  order_number?: string;
  customer_id?: string;
  status?: string;
  meal_type?: string;
  total_amount?: number;
  delivery_date?: string;
  delivery_address?: string;
  payment_status?: string;
  created_at?: string;
};

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });
        if (err) throw err;
        setOrders(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return { orders, loading, error };
};
