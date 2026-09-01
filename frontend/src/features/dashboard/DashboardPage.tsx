import { useEffect, useState } from "react";

import { getDashboard, type Dashboard } from "./dashboard.api";
import { StatCard } from "../../components/ui/StatCard";
import { AccountList } from "./AccountList";
import { RecentTransactions } from "./RecentTransactions";
import { SpendingByCategory } from "./SpendingByCategory";

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
        setError("Unable to load dashboard.");
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
    <section>
      <h2>Dashboard</h2>

      <div>
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

      <AccountList accounts={dashboard.accounts} />
      <RecentTransactions transactions={dashboard.recentTransactions} />
      <SpendingByCategory
        spending={dashboard.spending}
        total={dashboard.spendingTotal}
      />
    </section>
  );
}
