import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  CalendarDays,
  FileText,
  Wallet,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { LoadingMessage } from "../../components/ui/LoadingMessage";
import { getApiErrorMessage } from "../../lib/api-error";
import { getAccounts, type Account } from "../accounts/accounts.api";
import { createTransfer } from "./transfers.api";

interface TransferFormProps {
  onSaved?: () => Promise<void>;
  onCancel?: () => void;
}

export function TransferForm({ onSaved, onCancel }: TransferFormProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      setError(null);

      try {
        const response = await getAccounts();
        setAccounts(response.accounts);

        if (response.accounts.length >= 2) {
          setFromAccountId(response.accounts[0].id);
          setToAccountId(response.accounts[1].id);
        }
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "Unable to load accounts. Please try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadAccounts();
  }, []);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);

    if (fromAccountId === toAccountId) {
      setError("From and To accounts must be different.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransfer({
        fromAccountId,
        toAccountId,
        amount: Number(amount),
        ...(description.trim() ? { description: description.trim() } : {}),
        transferDate,
      });

      setAmount("");
      setDescription("");

      if (onSaved) {
        await onSaved();
      }
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to create transfer. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50";

  const labelStyles = "mb-1.5 block text-sm font-medium text-slate-700";

  if (isLoading) {
    return <LoadingMessage message="Loading accounts..." />;
  }

  if (accounts.length < 2) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Wallet size={18} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Transfer
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Move money between your accounts.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <Wallet size={30} className="mx-auto text-slate-300" />

          <p className="mt-3 text-sm font-semibold text-slate-700">
            You need at least two accounts
          </p>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Create another account before making a transfer between accounts.
          </p>
        </div>

        {onCancel && (
          <div className="mt-5 flex justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ArrowRightLeft size={18} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add Transfer</h2>

          <p className="mt-1 text-sm text-slate-500">
            Move money from one account to another.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <ArrowRightLeft size={15} />
            Transfer route
          </div>

          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div>
              <label htmlFor="from-account" className={labelStyles}>
                From Account
              </label>

              <select
                id="from-account"
                value={fromAccountId}
                onChange={(event) => setFromAccountId(event.target.value)}
                required
                disabled={isSubmitting}
                className={inputStyles}
              >
                <option value="">Select account</option>

                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden h-11 items-center justify-center text-slate-300 sm:flex">
              <ArrowRight size={20} />
            </div>

            <div>
              <label htmlFor="to-account" className={labelStyles}>
                To Account
              </label>

              <select
                id="to-account"
                value={toAccountId}
                onChange={(event) => setToAccountId(event.target.value)}
                required
                disabled={isSubmitting}
                className={inputStyles}
              >
                <option value="">Select account</option>

                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="transfer-amount" className={labelStyles}>
              Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                £
              </span>

              <input
                id="transfer-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
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
            <label htmlFor="transfer-date" className={labelStyles}>
              Transfer Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="transfer-date"
                type="date"
                value={transferDate}
                onChange={(event) => setTransferDate(event.target.value)}
                required
                disabled={isSubmitting}
                className={`${inputStyles} pl-10`}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="transfer-description" className={labelStyles}>
            Description
          </label>

          <div className="relative">
            <FileText
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="transfer-description"
              type="text"
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional transfer description"
              disabled={isSubmitting}
              className={`${inputStyles} pl-10`}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting ? "Saving..." : "Add Transfer"}
          </Button>
        </div>
      </form>
    </section>
  );
}
