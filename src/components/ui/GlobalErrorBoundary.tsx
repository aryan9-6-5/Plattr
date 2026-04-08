import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/utils/logger";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Lifecycle Crash caught by ErrorBoundary", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6FFF8] px-4 text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg">
            <AlertCircle className="h-10 w-10" />
          </div>
          
          <h1 className="mb-3 text-3xl font-serif font-bold text-[#1B2D24]">Something went wrong</h1>
          <p className="mb-8 max-w-md text-[#4A6357]">
            We've encountered an unexpected error. Our team has been notified and we're looking into it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 py-6 h-auto rounded-2xl flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="border-[#D4E8DA] text-[#4A6357] hover:bg-[#EEF8F1] px-8 py-6 h-auto rounded-2xl flex items-center gap-2"
            >
              <Home className="h-4 w-4" /> Back Home
            </Button>
          </div>
          
          <div className="mt-12 text-[10px] text-[#7A9A88] font-mono tracking-tighter opacity-50">
            ERR_PRODUCTION_CRASH_CAPTURED
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
