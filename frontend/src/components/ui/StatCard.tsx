import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: "positive" | "negative" | "neutral";
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = "neutral",
}: StatCardProps) {
  const trendStyles = {
    positive: "bg-emerald-50 text-emerald-700",
    negative: "bg-red-50 text-red-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${trendStyles[trend]}`}
          >
            {change}
          </span>

          {changeLabel && (
            <span className="text-xs text-slate-400">{changeLabel}</span>
          )}
        </div>
      )}
    </article>
  );
}
