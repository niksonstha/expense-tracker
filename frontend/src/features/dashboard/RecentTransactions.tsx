import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from "lucide-react";
import type { DashboardTransaction } from "./dashboard.api";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatAmount(amount: string, type: DashboardTransaction["type"]) {
    const numericAmount = Number(amount);

    if (type === "EXPENSE") {
      return `-£${numericAmount.toFixed(2)}`;
    }

    if (type === "INCOME") {
      return `+£${numericAmount.toFixed(2)}`;
    }

    return `£${numericAmount.toFixed(2)}`;
  }

  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent transactions
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your latest financial activity.
            </p>
          </div>
        </div>

        <div className="flex min-h-56 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <CircleDollarSign size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No transactions yet
          </p>

          <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
            Add your first transaction to start tracking your finances.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your latest financial activity.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "INCOME";

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isIncome
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft size={19} />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {transaction.description || "Transaction"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {transaction.type} ·{" "}
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>

              <p
                className={`shrink-0 text-sm font-semibold ${
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
