import type { DashboardSpending } from "./dashboard.api";

interface SpendingByCategoryProps {
  spending: DashboardSpending[];
}

const categoryColors = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

export function SpendingByCategory({ spending }: SpendingByCategoryProps) {
  const total = spending.reduce((sum, item) => sum + Number(item.amount), 0);

  if (spending.length === 0 || total === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Spending by category
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            See where your money is going.
          </p>
        </div>

        <div className="flex min-h-56 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <div className="h-5 w-5 rounded-full border-4 border-slate-300 dark:border-slate-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No spending data
          </p>

          <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
            Expense activity will appear here once you start spending.
          </p>
        </div>
      </section>
    );
  }

  const gradient = spending
    .map((item, index) => {
      const percentage = Number(item.percentage);

      const start = spending
        .slice(0, index)
        .reduce(
          (sum, previousItem) => sum + Number(previousItem.percentage),
          0,
        );

      const end = start + percentage;

      return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Spending by category
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          See where your money is going.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Total
            </span>

            <span className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              £{total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {spending.map((item, index) => (
            <div
              key={item.categoryId}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      categoryColors[index % categoryColors.length],
                  }}
                />

                <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {item.category}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  £{Number(item.amount).toFixed(2)}
                </span>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {Number(item.percentage).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
