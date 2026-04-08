import { createContext, useContext } from "react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastContextValue = {
  addToast: (message: string, type: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
