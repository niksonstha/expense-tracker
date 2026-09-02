import { useEffect, useState } from "react";
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

  useEffect(() => {
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

    void loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingMessage message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <p className="page-error" role="alert">
        {error}
      </p>
    );
  }

  if (!dashboard) {
    return <p className="page-error">No dashboard data available.</p>;
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
    <section className="dashboard">
      <div className="dashboard__heading">
        <div>
          <span className="dashboard__eyebrow">Overview</span>
          <h1>Dashboard</h1>
          <p>Your financial activity for {period}.</p>
        </div>
      </div>

      <div className="dashboard__stats">
        <StatCard
          title="Total Balance"
          value={formatCurrency(dashboard.summary.totalBalance)}
        />

        <StatCard
          title="Income"
          value={formatCurrency(dashboard.summary.totalIncome)}
        />

        <StatCard
          title="Expenses"
          value={formatCurrency(dashboard.summary.totalExpense)}
        />

        <StatCard
          title="Net This Month"
          value={formatCurrency(netThisMonth.toFixed(2))}
        />
      </div>

      <div className="dashboard__content">
        <AccountList accounts={dashboard.accounts} />

        <RecentTransactions transactions={dashboard.recentTransactions} />

        <SpendingByCategory
          spending={dashboard.spending}
          total={dashboard.spendingTotal}
        />
      </div>
    </section>
  );
}
