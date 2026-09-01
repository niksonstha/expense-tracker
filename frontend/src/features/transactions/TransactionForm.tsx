/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

import { Button } from "../../components/ui/Button";
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

        console.log("Transaction accounts:", accountsResponse);
        console.log("Transaction categories:", categoriesResponse);

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

  if (isLoadingOptions) {
    return (
      <section className="form-section">
        <h2>Add Transaction</h2>
        <p>Loading transaction options...</p>
      </section>
    );
  }

  if (accounts.length === 0) {
    return (
      <section className="form-section">
        <h2>Add Transaction</h2>
        <p>You need to create an account before adding a transaction.</p>
      </section>
    );
  }

  return (
    <section className="form-section">
      <h2>{transaction ? "Edit Transaction" : "Add Transaction"}</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="transaction-account">Account</label>

          <select
            id="transaction-account"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            required
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="transaction-type">Type</label>

          <select
            id="transaction-type"
            value={type}
            onChange={(event) => setType(event.target.value as TransactionType)}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="transaction-category">Category</label>

          <select
            id="transaction-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">No category</option>

            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="transaction-amount">Amount</label>

          <input
            id="transaction-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="transaction-description">Description</label>

          <input
            id="transaction-description"
            type="text"
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="transaction-date">Transaction Date</label>

          <input
            id="transaction-date"
            type="date"
            value={transactionDate}
            onChange={(event) => setTransactionDate(event.target.value)}
            required
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : transaction
              ? "Update Transaction"
              : "Add Transaction"}
        </Button>

        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}
