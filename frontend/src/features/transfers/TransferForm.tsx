import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "../../components/ui/Button";
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

  if (isLoading) {
    return <p>Loading accounts...</p>;
  }

  if (accounts.length < 2) {
    return (
      <div>
        <h2>Add Transfer</h2>
        <p>You need at least two accounts to create a transfer.</p>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add Transfer</h2>

      {error && <p className="form-error">{error}</p>}

      <label>
        From Account
        <select
          value={fromAccountId}
          onChange={(event) => setFromAccountId(event.target.value)}
          required
        >
          <option value="">Select account</option>

          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        To Account
        <select
          value={toAccountId}
          onChange={(event) => setToAccountId(event.target.value)}
          required
        >
          <option value="">Select account</option>

          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Amount
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </label>

      <label>
        Description
        <input
          type="text"
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional"
        />
      </label>

      <label>
        Transfer Date
        <input
          type="date"
          value={transferDate}
          onChange={(event) => setTransferDate(event.target.value)}
          required
        />
      </label>

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Transfer"}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
