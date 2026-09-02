import { CreditCard, Wallet } from "lucide-react";
import type { DashboardAccount } from "./dashboard.api";

interface AccountListProps {
  accounts: DashboardAccount[];
}

export function AccountList({ accounts }: AccountListProps) {
  function formatCurrency(amount: string) {
    return `£${Number(amount).toFixed(2)}`;
  }

  function getAccountIcon(type: DashboardAccount["type"]) {
    return type === "CREDIT_CARD" ? CreditCard : Wallet;
  }

  function formatAccountType(type: DashboardAccount["type"]) {
    return type
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (accounts.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Your accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your financial accounts.
          </p>
        </div>

        <div className="flex min-h-40 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Wallet size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No accounts yet
          </p>

          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Add an account to start tracking your balance.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Your accounts
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of your connected accounts.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type);
          const balance = Number(account.balance);

          return (
            <div
              key={account.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                  <Icon size={19} />
                </div>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {formatAccountType(account.type)}
                </span>
              </div>

              <p className="mt-4 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                {account.name}
              </p>

              <p
                className={`mt-1 text-xl font-bold tracking-tight ${
                  balance < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {formatCurrency(account.balance)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
