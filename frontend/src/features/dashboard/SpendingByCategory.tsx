import { PieChart } from "lucide-react";
import type { DashboardSpending } from "./dashboard.api";

interface SpendingByCategoryProps {
  spending: DashboardSpending[];
  total: string;
}

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

export function SpendingByCategory({
  spending,
  total,
}: SpendingByCategoryProps) {
  const totalAmount = Number(total);

  const colors = [
    "#10b981",
    "#0ea5e9",
    "#8b5cf6",
    "#f59e0b",
    "#f43f5e",
    "#94a3b8",
  ];

  const segments = spending.map((item, index) => {
    const percentage = Math.min(Math.max(Number(item.percentage), 0), 100);

    const start = spending
      .slice(0, index)
      .reduce(
        (total, previousItem) =>
          total + Math.min(Math.max(Number(previousItem.percentage), 0), 100),
        0,
      );

    return {
      ...item,
      percentage,
      start,
      end: start + percentage,
      color: colors[index % colors.length],
    };
  });

  const gradient = segments.length
    ? `conic-gradient(${segments
        .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
        .join(", ")})`
    : "conic-gradient(#e2e8f0 0% 100%)";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <PieChart size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Spending by category
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your spending breakdown this month
          </p>
        </div>
      </div>

      {spending.length === 0 || totalAmount <= 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <PieChart size={30} className="mx-auto text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            No spending recorded
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Category spending will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div
                className="h-44 w-44 rounded-full"
                style={{ background: gradient }}
              />

              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-xs text-slate-500">Total</span>

                <strong className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                  {formatCurrency(total)}
                </strong>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              {segments.map((item) => (
                <div key={item.categoryId} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
                    {item.category}
                  </span>

                  <span className="text-xs font-semibold text-slate-500">
                    {item.percentage.toFixed(1)}%
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
