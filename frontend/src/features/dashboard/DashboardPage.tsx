import { useEffect, useState } from "react";

import { getDashboard, type Dashboard } from "./dashboard.api";
import { StatCard } from "../../components/ui/StatCard";
import { AccountList } from "./AccountList";
import { RecentTransactions } from "./RecentTransactions";
import { SpendingByCategory } from "./SpendingByCategory";
import { getApiErrorMessage } from "../../lib/api-error";

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboard();

        setDashboard(response.dashboard);
      } catch {
        setError(getApiErrorMessage(error, "Unable to load dashboard."));
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [error]);

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
          <h2>Dashboard</h2>

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
