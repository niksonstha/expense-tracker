/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Banknote, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../lib/api-error";
import {
  createAccount,
  updateAccount,
  type Account,
  type AccountType,
} from "./accounts.api";

interface AccountFormProps {
  account?: Account | null;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
}

const accountTypes: AccountType[] = ["BANK", "SAVINGS", "CASH", "CREDIT_CARD"];

function formatAccountType(type: AccountType) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getAccountIcon(type: AccountType) {
  switch (type) {
    case "BANK":
      return Landmark;
    case "SAVINGS":
      return Banknote;
    case "CREDIT_CARD":
      return CreditCard;
    default:
      return Wallet;
  }
}

export function AccountForm({ account, onSaved, onCancel }: AccountFormProps) {
  const isEditing = account !== null && account !== undefined;

  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState<AccountType>(account?.type ?? "BANK");
  const [initialBalance, setInitialBalance] = useState(
    account?.initialBalance ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(account?.name ?? "");
    setType(account?.type ?? "BANK");
    setInitialBalance(account?.initialBalance ?? "");
    setError(null);
  }, [account]);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Account name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateAccount(account.id, {
          name: trimmedName,
          type,
          initialBalance: Number(initialBalance),
        });
      } else {
        await createAccount({
          name: trimmedName,
          type,
          initialBalance: Number(initialBalance),
        });
      }

      setName("");
      setType("BANK");
      setInitialBalance("");

      await onSaved();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          isEditing
            ? "Unable to update account. Please try again."
            : "Unable to create account. Please try again.",
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

  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Wallet size={18} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isEditing ? "Edit Account" : "Add Account"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update your account details."
                : "Add a financial account to track your balance."}
            </p>
          </div>
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
            <label htmlFor="account-name" className={labelStyles}>
              Account Name
            </label>

            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Main Bank Account"
              required
              autoComplete="off"
              disabled={isSubmitting}
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="initial-balance" className={labelStyles}>
              Initial Balance
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                £
              </span>

              <input
                id="initial-balance"
                type="number"
                step="0.01"
                inputMode="decimal"
                value={initialBalance}
                onChange={(event) => setInitialBalance(event.target.value)}
                placeholder="0.00"
                required
                disabled={isSubmitting}
                className={`${inputStyles} pl-9 text-base font-semibold`}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelStyles}>Account Type</label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {accountTypes.map((accountType) => {
              const Icon = getAccountIcon(accountType);
              const isSelected = type === accountType;

              return (
                <button
                  key={accountType}
                  type="button"
                  onClick={() => setType(accountType)}
                  disabled={isSubmitting}
                  className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition ${
                    isSelected
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900/50"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon size={19} />

                  <span className="text-xs font-semibold">
                    {formatAccountType(accountType)}
                  </span>
                </button>
              );
            })}
          </div>

          <select
            id="account-type"
            value={type}
            onChange={(event) => setType(event.target.value as AccountType)}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          >
            {accountTypes.map((accountType) => (
              <option key={accountType} value={accountType}>
                {formatAccountType(accountType)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          {isEditing && onCancel && (
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
              : isEditing
                ? "Save Changes"
                : "Add Account"}
          </Button>
        </div>
      </form>
    </section>
  );
}
