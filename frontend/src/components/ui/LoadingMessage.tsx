import { Loader2 } from "lucide-react";

interface LoadingMessageProps {
  message?: string;
}

export function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-500 dark:text-slate-400">
      <Loader2
        size={18}
        className="animate-spin text-emerald-600 dark:text-emerald-400"
      />
      <span>{message}</span>
    </div>
  );
}
