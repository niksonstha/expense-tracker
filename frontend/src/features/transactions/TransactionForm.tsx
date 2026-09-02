/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Wallet,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { LoadingMessage } from "../../components/ui/LoadingMessage";
import { getApiErrorMessage } from "../../lib/api-error";
import { getAccounts, type Account } from "../accounts/accounts.api";
import { getCategories, type Category } from "../categories/categories.api";
import {
  updateTransaction,
  createTransaction,
  type Transaction,
  type TransactionType,
} from "./transactions.api";

interface TransactionFormProps {
  transaction?: Transaction;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
}

export function TransactionForm({
  transaction,
  onSaved,
  onCancel,
}: TransactionFormProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFormOptions() {
      try {
        const [accountsResponse, categoriesResponse] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        setAccounts(accountsResponse.accounts);
        setCategories(categoriesResponse.categories);

        if (accountsResponse.accounts.length > 0 && !transaction) {
          setAccountId(accountsResponse.accounts[0].id);
        }
      } catch (error) {
        setError(
          getApiErrorMessage(error, "Unable to load transaction options."),
        );
      } finally {
        setIsLoadingOptions(false);
      }
    }

    void loadFormOptions();
  }, [transaction]);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    setAccountId(transaction.accountId);
    setCategoryId(transaction.categoryId ?? "");
    setType(transaction.type);
    setAmount(transaction.amount);
    setDescription(transaction.description ?? "");
    setTransactionDate(transaction.transactionDate.slice(0, 10));
  }, [transaction]);

  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  useEffect(() => {
    if (
      categoryId &&
      !filteredCategories.some((category) => category.id === categoryId)
    ) {
      setCategoryId("");
    }
  }, [categoryId, filteredCategories]);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (transaction) {
        await updateTransaction(transaction.id, {
          accountId,
          ...(categoryId ? { categoryId } : { categoryId: null }),
          type: type as "INCOME" | "EXPENSE",
          amount: Number(amount),
          ...(description.trim()
            ? { description: description.trim() }
            : { description: null }),
          transactionDate,
        });
      } else {
        await createTransaction({
          accountId,
          ...(categoryId ? { categoryId } : {}),
          type: type as "INCOME" | "EXPENSE",
          amount: Number(amount),
          ...(description.trim() ? { description: description.trim() } : {}),
          transactionDate,
        });
      }

      await onSaved();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          transaction
            ? "Unable to update transaction. Please try again."
            : "Unable to create transaction. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50 dark:disabled:bg-slate-900";

  const labelStyles =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  if (isLoadingOptions) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Loading your accounts and categories...
          </p>
        </div>

        <LoadingMessage message="Loading transaction options..." />
      </section>
    );
  }

  if (accounts.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <Wallet
          className="mx-auto text-slate-300 dark:text-slate-600"
          size={30}
        />

        <h2 className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-200">
          No accounts available
        </h2>

        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">
          You need to create an account before adding a transaction.
        </p>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {transaction
              ? "Update the details of this transaction."
              : "Record a new income or expense."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="transaction-account" className={labelStyles}>
              Account
            </label>

            <div className="relative">
              <Wallet
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="transaction-account"
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                required
                disabled={isSubmitting}
                className={`${inputStyles} pl-10`}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="transaction-type" className={labelStyles}>
              Type
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  type === "EXPENSE"
                    ? "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                <ArrowUpRight size={17} />
                Expense
              </button>

              <button
                type="button"
                onClick={() => setType("INCOME")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  type === "INCOME"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                <ArrowDownLeft size={17} />
                Income
              </button>
            </div>

            <select
              id="transaction-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as TransactionType)
              }
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="transaction-amount" className={labelStyles}>
              Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                £
              </span>

              <input
                id="transaction-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
                disabled={isSubmitting}
                className={`${inputStyles} pl-9 text-base font-semibold`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="transaction-category" className={labelStyles}>
              Category
            </label>

            <select
              id="transaction-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={isSubmitting}
              className={inputStyles}
            >
              <option value="">No category</option>

              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="transaction-description" className={labelStyles}>
              Description
            </label>

            <div className="relative">
              <FileText
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="transaction-description"
                type="text"
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Grocery shopping"
                disabled={isSubmitting}
                className={`${inputStyles} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="transaction-date" className={labelStyles}>
              Transaction Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="transaction-date"
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                required
                disabled={isSubmitting}
                className={`${inputStyles} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}

          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting
              ? "Saving..."
              : transaction
                ? "Update Transaction"
                : "Add Transaction"}
          </Button>
        </div>
      </form>
    </section>
  );
}
