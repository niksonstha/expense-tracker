import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { createTransaction } from "./transactions.api";
import { getAccounts, type Account } from "../accounts/accounts.api";
import { getCategories, type Category } from "../categories/categories.api";
import { getApiErrorMessage } from "../../lib/api-error";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function loadFormData() {
      try {
        setError(null);
        setIsLoadingData(true);

        const [accountsResponse, categoriesResponse] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        setAccounts(accountsResponse.accounts);
        setCategories(
          categoriesResponse.categories.filter(
            (category) => category.type === "EXPENSE",
          ),
        );
      } catch (error) {
        setError(
          getApiErrorMessage(error, "Unable to load accounts and categories."),
        );
      } finally {
        setIsLoadingData(false);
      }
    }

    void loadFormData();
  }, [isOpen]);

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setAmount("");
    setDescription("");
    setAccountId("");
    setCategoryId("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
    setError(null);

    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!accountId) {
      setError("Please select an account.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      await createTransaction({
        accountId,
        categoryId: categoryId || undefined,
        type: "EXPENSE",
        amount: Number(amount),
        description: description.trim() || undefined,
        transactionDate,
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to add expense."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="add-expense-title"
              className="text-lg font-semibold text-slate-900"
            >
              Add expense
            </h2>

            <p className="mt-1 text-xs text-slate-500">Record a new expense.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close add expense"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="expense-amount"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Amount
            </label>

            <input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="expense-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <input
              id="expense-description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Grocery shopping"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="expense-account"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Account
            </label>

            <select
              id="expense-account"
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              disabled={isLoadingData || isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            >
              <option value="">
                {isLoadingData ? "Loading accounts..." : "Select an account"}
              </option>

              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expense-category"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="expense-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={isLoadingData || isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            >
              <option value="">
                {isLoadingData ? "Loading categories..." : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expense-date"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Date
            </label>

            <input
              id="expense-date"
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingData}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
