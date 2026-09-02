{
  /* eslint-disable react-hooks/set-state-in-effect */
}
{
  /* eslint-disable react-hooks/exhaustive-deps */
}

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
import { AlertTriangle, Search, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDelete() {
    if (!transactionToDelete) {
      return;
    }

    try {
      setError(null);
      setIsDeleting(true);

      await deleteTransaction(transactionToDelete.id);

      const nextPage =
        transactions.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      setCurrentPage(nextPage);
      setTransactionToDelete(null);

      await loadTransactions(nextPage);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete transaction. Please try again.",
        ),
      );
    } finally {
      setIsDeleting(false);
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

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const account = accounts.find((item) => item.id === transaction.accountId);

    const category = transaction.categoryId
      ? categories.find((item) => item.id === transaction.categoryId)
      : undefined;

    return [
      transaction.description,
      transaction.type,
      account?.name,
      category?.name,
      transaction.amount,
    ]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Activity
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your income and expenses.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            onClick={handleAddTransaction}
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
          >
            Add Transaction
          </Button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {isFormOpen && (
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
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

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Transaction history
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              View and manage your transaction history.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-64">
              <label htmlFor="transaction-search" className="sr-only">
                Search transactions
              </label>

              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                id="transaction-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50"
              />
            </div>

            <div className="w-full sm:w-44">
              <label htmlFor="transaction-type-filter" className="sr-only">
                Filter by transaction type
              </label>

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
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50"
              >
                <option value="ALL">All transactions</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expenses</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6">
            <LoadingMessage message="Loading transactions..." />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="text-lg">£</span>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No transactions found
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400 dark:text-slate-500">
              There are no transactions matching the current filter.
            </p>

            {!isFormOpen && (
              <button
                type="button"
                onClick={handleAddTransaction}
                className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                Add Transaction
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((transaction) => {
                const account = accounts.find(
                  (item) => item.id === transaction.accountId,
                );

                const category = transaction.categoryId
                  ? categories.find(
                      (item) => item.id === transaction.categoryId,
                    )
                  : undefined;

                const isIncome = transaction.direction === "IN";

                return (
                  <article
                    key={transaction.id}
                    className="group flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : transaction.type === "TRANSFER"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <span className="text-base font-bold">
                          {isIncome
                            ? "+"
                            : transaction.type === "TRANSFER"
                              ? "↔"
                              : "−"}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {transaction.description ?? transaction.type}
                          </h3>

                          {transaction.type === "TRANSFER" && (
                            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                              Transfer
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {account?.name ?? "Unknown account"}
                          {" · "}
                          {category?.name ?? "No category"}
                          {" · "}
                          {new Date(
                            transaction.transactionDate,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <strong
                        className={`text-sm font-semibold ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {isIncome ? "+" : "-"}£{transaction.amount}
                      </strong>

                      <div className="flex items-center gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        {transaction.type !== "TRANSFER" && (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleEditTransaction(transaction)}
                            className="px-3 py-2 text-xs"
                          >
                            Edit
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setTransactionToDelete(transaction)}
                          className="px-3 py-2 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                <button
                  type="button"
                  disabled={!hasPreviousPage}
                  onClick={() => {
                    void loadTransactions(currentPage - 1);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() => {
                    void loadTransactions(currentPage + 1);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {transactionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-transaction-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="delete-transaction-title"
                      className="text-base font-semibold text-slate-900 dark:text-white"
                    >
                      Delete transaction?
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      This action cannot be undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTransactionToDelete(null)}
                    disabled={isDeleting}
                    aria-label="Close confirmation"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {transactionToDelete.description ??
                      transactionToDelete.type}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {transactionToDelete.direction === "IN" ? "+" : "-"}£
                    {transactionToDelete.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setTransactionToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete transaction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
