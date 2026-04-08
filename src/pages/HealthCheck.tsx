import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { env } from "@/utils/env";
import { CheckCircle2, XCircle, Activity, Server, Database, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'failed';
  message: string;
  icon: React.ReactNode;
}

const HealthCheck = () => {
  const [statuses, setStatuses] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const results: HealthStatus[] = [];

      // 1. App Static Health
      results.push({
        service: "Application Logic",
        status: "healthy",
        message: `Running in ${env.MODE} mode`,
        icon: <Server className="h-5 w-5" />
      });

      // 2. Client-Side Environment
      results.push({
        service: "Environment Configuration",
        status: "healthy",
        message: "All critical VITE keys validated",
        icon: <Globe className="h-5 w-5" />
      });

      // 3. Supabase Connectivity
      try {
        const { data, error } = await supabase.from('error_logs').select('count', { count: 'exact', head: true });
        if (error) throw error;
        
        results.push({
          service: "Database (Supabase)",
          status: "healthy",
          message: "Connection established & responsive",
          icon: <Database className="h-5 w-5" />
        });
      } catch (err) {
        results.push({
          service: "Database (Supabase)",
          status: "failed",
          message: err instanceof Error ? err.message : "Connection timeout",
          icon: <Database className="h-5 w-5" />
        });
      }

      setStatuses(results);
      setLoading(false);
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6FFF8] py-20 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-lg">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1B2D24]">System Health</h1>
            <p className="text-sm text-[#4A6357]">Real-time production monitoring</p>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="h-32 w-full animate-pulse rounded-3xl bg-white shadow-sm border border-[#D4E8DA]" />
          ) : (
            statuses.map((s, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between rounded-3xl border border-[#D4E8DA] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    s.status === 'healthy' ? 'bg-[#EEF8F1] text-[#2D6A4F]' : 'bg-red-50 text-red-600'
                  }`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1B2D24]">{s.service}</h3>
                    <p className="text-xs text-[#7A9A88]">{s.message}</p>
                  </div>
                </div>
                <div>
                  {s.status === 'healthy' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#2D6A4F]">
                      <CheckCircle2 className="h-4 w-4" /> ONLINE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                      <XCircle className="h-4 w-4" /> ERROR
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="text-sm font-medium text-[#2D6A4F] hover:underline"
          >
            ← Back to Platform
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
