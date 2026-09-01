import type { DashboardTransaction } from "./dashboard.api";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <h2>Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <p className="dashboard-empty">No transactions yet.</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <article className="transaction-row" key={transaction.id}>
              <div>
                <h3>{transaction.description ?? transaction.type}</h3>

                <p>{transaction.type}</p>
              </div>

              <strong
                className={
                  transaction.direction === "IN"
                    ? "transaction-amount transaction-amount--income"
                    : "transaction-amount transaction-amount--expense"
                }
              >
                {transaction.direction === "IN" ? "+" : "-"}£
                {transaction.amount}
              </strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
