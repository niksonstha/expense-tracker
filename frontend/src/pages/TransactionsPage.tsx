/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import {
  deleteTransaction,
  getTransactions,
  type Transaction,
} from "../features/transactions/transactions.api";
import { getAccounts, type Account } from "../features/accounts/accounts.api";
import {
  getCategories,
  type Category,
} from "../features/categories/categories.api";
import { getApiErrorMessage } from "../lib/api-error";
import { TransactionForm } from "../features/transactions/TransactionForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingMessage } from "../components/ui/LoadingMessage";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );

  async function loadTransactions(page: number) {
    try {
      setError(null);
      setIsLoading(true);

      const [transactionsResponse, accountsResponse, categoriesResponse] =
        await Promise.all([
          getTransactions({
            page,
            limit: 10,
            sort: "desc",
            ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
          }),
          getAccounts(),
          getCategories(),
        ]);

      setTransactions(transactionsResponse.transactions);
      setAccounts(accountsResponse.accounts);
      setCategories(categoriesResponse.categories);
      setCurrentPage(transactionsResponse.pagination.page);
      setTotalPages(transactionsResponse.pagination.totalPages);
      setHasNextPage(transactionsResponse.pagination.hasNextPage);
      setHasPreviousPage(transactionsResponse.pagination.hasPreviousPage);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to load transactions."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTransactions(1);
  }, [typeFilter]);

  async function handleDelete(transaction: Transaction) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteTransaction(transaction.id);

      const nextPage =
        transactions.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      setCurrentPage(nextPage);
      await loadTransactions(nextPage);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete transaction. Please try again.",
        ),
      );
    }
  }

  function handleAddTransaction() {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setEditingTransaction(undefined);
    setIsFormOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses.</p>
        </div>

        {!isFormOpen && (
          <Button type="button" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {isFormOpen && (
        <Card>
          <TransactionForm
            transaction={editingTransaction}
            onSaved={async () => {
              setEditingTransaction(undefined);
              setIsFormOpen(false);
              await loadTransactions(currentPage);
            }}
            onCancel={handleCancelForm}
          />
        </Card>
      )}

      <Card className="dashboard-section">
        <div className="dashboard-section__header">
          <div>
            <h2>Recent Transactions</h2>
            <p>View and manage your transaction history.</p>
          </div>

          <div className="form-field">
            <label htmlFor="transaction-type-filter">Type</label>
            <select
              id="transaction-type-filter"
              value={typeFilter}
              onChange={(event) => {
                const value = event.target.value as
                  | "ALL"
                  | "INCOME"
                  | "EXPENSE";

                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <LoadingMessage message="Loading transactions..." />
        ) : transactions.length === 0 ? (
          <p className="dashboard-empty">No transactions yet.</p>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => {
              const account = accounts.find(
                (item) => item.id === transaction.accountId,
              );

              const category = transaction.categoryId
                ? categories.find((item) => item.id === transaction.categoryId)
                : undefined;

              return (
                <article className="transaction-row" key={transaction.id}>
                  <div>
                    <h3>{transaction.description ?? transaction.type}</h3>

                    <p>
                      {account?.name ?? "Unknown account"}
                      {" · "}
                      {category?.name ?? "No category"}
                      {" · "}
                      {transaction.transactionDate}
                    </p>
                  </div>

                  <div className="transaction-row__right">
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

                    <div className="transaction-row__actions">
                      {transaction.type !== "TRANSFER" && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          Edit
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => void handleDelete(transaction)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}

            {!isLoading && totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  disabled={!hasPreviousPage}
                  onClick={() => {
                    void loadTransactions(currentPage - 1);
                  }}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() => {
                    void loadTransactions(currentPage + 1);
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
