import { useContext } from "react";
import { ToastContext } from "@/context/ToastContext";
import type { ToastContextValue, ToastType } from "@/context/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export type { ToastContextValue, ToastType };
