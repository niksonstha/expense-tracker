import { CreditCard, Wallet } from "lucide-react";
import type { DashboardAccount } from "./dashboard.api";

interface AccountListProps {
  accounts: DashboardAccount[];
}

function formatAccountType(type: DashboardAccount["type"]) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

function getAccountIcon(type: DashboardAccount["type"]) {
  if (type === "CREDIT_CARD") {
    return CreditCard;
  }

  return Wallet;
}

export function AccountList({ accounts }: AccountListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Accounts</h2>
          <p className="mt-1 text-xs text-slate-500">Your account balances</p>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <Wallet className="mx-auto text-slate-300" size={28} />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No accounts yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Your accounts will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);

            return (
              <article
                key={account.id}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {account.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatAccountType(account.type)}
                  </p>
                </div>

                <strong className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatCurrency(account.balance)}
                </strong>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
