/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
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

    try {
      if (isEditing) {
        await updateAccount(account.id, {
          name,
          type,
          initialBalance: Number(initialBalance),
        });
      } else {
        await createAccount({
          name,
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

  return (
    <section className="form-section">
      <h2>{isEditing ? "Edit Account" : "Add Account"}</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="account-name">Name</label>

          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="account-type">Type</label>

          <select
            id="account-type"
            value={type}
            onChange={(event) => setType(event.target.value as AccountType)}
          >
            {accountTypes.map((accountType) => (
              <option key={accountType} value={accountType}>
                {accountType}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="initial-balance">Initial Balance</label>

          <input
            id="initial-balance"
            type="number"
            step="0.01"
            value={initialBalance}
            onChange={(event) => setInitialBalance(event.target.value)}
            required
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Account"}
          </Button>

          {isEditing && onCancel && (
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
