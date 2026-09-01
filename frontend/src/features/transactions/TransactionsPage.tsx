/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../lib/api-error";
import { TransactionForm } from "./TransactionForm";
import { getTransactions, type Transaction } from "./transactions.api";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTransactions() {
    try {
      setError(null);

      const response = await getTransactions({
        page: 1,
        limit: 20,
        sort: "desc",
      });

      setTransactions(response.transactions);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to load transactions."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTransactions();
  }, []);

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h2>Transactions</h2>
          <p>Manage your income and expenses.</p>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      <TransactionForm
        onSaved={async () => {
          await loadTransactions();
        }}
      />

      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <h2>Recent Transactions</h2>
        </div>

        {isLoading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="dashboard-empty">No transactions yet.</p>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <article className="transaction-row" key={transaction.id}>
                <div>
                  <h3>{transaction.description ?? transaction.type}</h3>

                  <p>
                    {transaction.type} · {transaction.transactionDate}
                  </p>
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
    </section>
  );
}
