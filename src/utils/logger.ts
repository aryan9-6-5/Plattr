import { supabase } from "@/lib/supabaseClient";
import { env } from "./env";

type LogLevel = "info" | "warning" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  stack_trace?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async remoteLog(payload: LogPayload) {
    try {
      const { error } = await supabase.from("error_logs").insert({
        level: payload.level,
        message: payload.message,
        stack_trace: payload.stack_trace,
        metadata: payload.metadata || {},
        url: window.location.href,
        user_agent: navigator.userAgent,
      });

      if (error) console.error("Failed to send remote log:", error);
    } catch (err) {
      console.error("Critical error in logger:", err);
    }
  }

  public info(message: string, metadata?: Record<string, unknown>) {
    if (env.MODE === "development") {
      console.log(`[INFO] ${message}`, metadata || "");
    }
  }

  public warn(message: string, metadata?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, metadata || "");
    this.remoteLog({ level: "warning", message, metadata });
  }

  public error(message: string, error?: Error | string, metadata?: Record<string, unknown>) {
    const errorMsg = error instanceof Error ? error.message : error || message;
    const stack = error instanceof Error ? error.stack : undefined;

    console.error(`[ERROR] ${message}`, error || "");
    
    // Always log errors to Supabase
    this.remoteLog({ 
      level: "error", 
      message: `${message}: ${errorMsg}`, 
      stack_trace: stack, 
      metadata 
    });
  }
}

export const logger = Logger.getInstance();
