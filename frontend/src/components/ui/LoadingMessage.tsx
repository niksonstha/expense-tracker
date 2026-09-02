import { LoaderCircle } from "lucide-react";

interface LoadingMessageProps {
  message?: string;
}

export function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return (
    <div
      className="flex min-h-32 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <LoaderCircle size={18} className="animate-spin text-emerald-600" />
        <span>{message}</span>
      </div>
    </div>
  );
}
