import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from "lucide-react";
import type { DashboardTransaction } from "./dashboard.api";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

function formatTransactionType(type: DashboardTransaction["type"]) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

function getTransactionIcon(type: DashboardTransaction["type"]) {
  if (type === "INCOME") {
    return ArrowDownLeft;
  }

  if (type === "EXPENSE") {
    return ArrowUpRight;
  }

  return CircleDollarSign;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent transactions
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Your latest financial activity
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <CircleDollarSign className="mx-auto text-slate-300" size={28} />

          <p className="mt-3 text-sm font-medium text-slate-600">
            No transactions yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your recent activity will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const isIncome = transaction.direction === "IN";

            return (
              <article
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                key={transaction.id}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isIncome
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {transaction.description ??
                      formatTransactionType(transaction.type)}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {formatTransactionType(transaction.type)}
                    {" · "}
                    {new Date(transaction.transactionDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                <strong
                  className={`shrink-0 text-sm font-semibold ${
                    isIncome ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </strong>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
