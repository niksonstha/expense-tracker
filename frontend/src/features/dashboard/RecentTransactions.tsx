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
                <h3>
                  {transaction.description ??
                    formatTransactionType(transaction.type)}
                </h3>

                <p>
                  {formatTransactionType(transaction.type)}
                  {" · "}
                  {new Date(transaction.transactionDate).toLocaleDateString(
                    "en-GB",
                  )}
                </p>
              </div>

              <strong
                className={
                  transaction.direction === "IN"
                    ? "transaction-amount transaction-amount--income"
                    : "transaction-amount transaction-amount--expense"
                }
              >
                {transaction.direction === "IN" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
