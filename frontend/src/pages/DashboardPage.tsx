import { useEffect, useState } from "react";
import {
  getDashboard,
  type Dashboard,
} from "../features/dashboard/dashboard.api";
import { getApiErrorMessage } from "../lib/api-error";
import { StatCard } from "../components/ui/StatCard";
import { AccountList } from "../features/dashboard/AccountList";
import { RecentTransactions } from "../features/dashboard/RecentTransactions";
import { SpendingByCategory } from "../features/dashboard/SpendingByCategory";

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
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!dashboard) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <section className="dashboard">
      <div className="dashboard__heading">
        <div>
          <h1>Dashboard</h1>

          <p>
            {new Date(
              dashboard.period.year,
              dashboard.period.month - 1,
            ).toLocaleString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="dashboard__stats">
        <StatCard
          title="Total Balance"
          value={`£${dashboard.summary.totalBalance}`}
        />

        <StatCard
          title="Total Income"
          value={`£${dashboard.summary.totalIncome}`}
        />

        <StatCard
          title="Total Expenses"
          value={`£${dashboard.summary.totalExpense}`}
        />

        <StatCard
          title="Net This Month"
          value={`£${(
            Number(dashboard.summary.totalIncome) -
            Number(dashboard.summary.totalExpense)
          ).toFixed(2)}`}
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
