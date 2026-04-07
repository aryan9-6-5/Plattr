import { AlertCircle, RefreshCw } from "lucide-react";

type PageErrorProps = {
  message?: string;
  onRetry?: () => void;
};

const PageError = ({ message = "Something went wrong", onRetry }: PageErrorProps) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="w-14 h-14 rounded-full bg-[#FFEBEE] flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-[#D32F2F]" />
    </div>
    <h3 className="text-lg font-semibold text-[#1B2D24] mb-2">Couldn't load content</h3>
    <p className="text-sm text-[#7A9A88] max-w-sm mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);

export default PageError;
