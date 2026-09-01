import type { DashboardTransaction } from "./dashboard.api";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <section>
        <h2>Recent Transactions</h2>
        <p>No transactions yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Recent Transactions</h2>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>{transaction.type}</strong>

            <span>
              {" "}
              — £{transaction.amount}
              {transaction.description ? ` — ${transaction.description}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
