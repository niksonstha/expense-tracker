/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Wallet,
} from "lucide-react";

import {
  getDashboard,
  type Dashboard,
} from "../features/dashboard/dashboard.api";
import { getApiErrorMessage } from "../lib/api-error";
import { LoadingMessage } from "../components/ui/LoadingMessage";
import { StatCard } from "../components/ui/StatCard";
import { AccountList } from "../features/dashboard/AccountList";
import { RecentTransactions } from "../features/dashboard/RecentTransactions";
import { SpendingByCategory } from "../features/dashboard/SpendingByCategory";
import { AddExpenseModal } from "../features/transactions/AddExpenseModal";

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  async function loadDashboard() {
    try {
      setError(null);
      const response = await getDashboard();
      setDashboard(response.dashboard);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to load dashboard."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingMessage message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="alert">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-center">
          <p className="text-sm font-semibold text-red-700">
            Unable to load dashboard
          </p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No dashboard data available
          </p>
          <p className="mt-1 text-sm text-slate-400">
            There is currently no financial data to display.
          </p>
        </div>
      </div>
    );
  }

  const netThisMonth =
    Number(dashboard.summary.totalIncome) -
    Number(dashboard.summary.totalExpense);

  const period = new Date(
    dashboard.period.year,
    dashboard.period.month - 1,
  ).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">Overview</p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's your financial overview for {period}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpenseModalOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(dashboard.summary.totalBalance)}
          icon={Wallet}
        />

        <StatCard
          title="Total Income"
          value={formatCurrency(dashboard.summary.totalIncome)}
          icon={ArrowDownLeft}
          trend="positive"
        />

        <StatCard
          title="Total Expenses"
          value={formatCurrency(dashboard.summary.totalExpense)}
          icon={ArrowUpRight}
          trend="negative"
        />

        <StatCard
          title="Savings"
          value={formatCurrency(netThisMonth.toFixed(2))}
          icon={PiggyBank}
          trend={netThisMonth >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="min-w-0">
          <RecentTransactions transactions={dashboard.recentTransactions} />
        </div>

        <div className="min-w-0">
          <SpendingByCategory
            spending={dashboard.spending}
            total={dashboard.spendingTotal}
          />
        </div>

        <div className="xl:col-span-2">
          <AccountList accounts={dashboard.accounts} />
        </div>
      </div>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={() => {
          void loadDashboard();
        }}
      />
    </section>
  );
}
