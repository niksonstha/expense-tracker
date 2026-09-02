import { CheckCircle2, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  message: ReactNode;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-sm ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/80 dark:text-emerald-100"
          : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/80 dark:text-red-100"
      }`}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
      ) : (
        <XCircle
          size={20}
          className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
        />
      )}

      <p className="flex-1 text-sm font-medium leading-5">{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}
