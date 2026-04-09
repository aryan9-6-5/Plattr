import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  ServicePipeline, 
  ComboPack, 
  SnackPack, 
  ServiceConfig 
} from "@/types/infrastructure";

export const useServicePipelines = () => {
  const [pipelines, setPipelines] = useState<ServicePipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const { data, error } = await supabase
          .from("service_pipelines")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setPipelines(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();
  }, []);

  return { pipelines, loading, error };
};

export const useComboPacks = (dietType?: string) => {
  const [combos, setCombos] = useState<ComboPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        let query = supabase
          .from("combo_packs")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (dietType && dietType !== "All") {
          query = query.eq("diet_type", dietType);
        }

        const { data, error } = await query;
        if (error) throw error;
        setCombos(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, [dietType]);

  return { combos, loading, error };
};

export const useSnackPacks = (dietType?: string) => {
  const [snacks, setSnacks] = useState<SnackPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        let query = supabase
          .from("snack_packs")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (dietType && dietType !== "All") {
          query = query.eq("diet_type", dietType);
        }

        const { data, error } = await query;
        if (error) throw error;
        setSnacks(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, [dietType]);

  return { snacks, loading, error };
};

export const useServiceConfigs = (configType: string) => {
  const [configs, setConfigs] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const { data, error } = await supabase
          .from("service_configs")
          .select("*")
          .eq("config_type", configType)
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setConfigs(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [configType]);

  return { configs, loading, error };
};
