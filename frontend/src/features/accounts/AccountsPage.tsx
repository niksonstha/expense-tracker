/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../lib/api-error";
import { deleteAccount, getAccounts, type Account } from "./accounts.api";
import { AccountForm } from "./AccountForm";

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  async function handleDelete(account: Account) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteAccount(account.id);

      if (editingAccount?.id === account.id) {
        setEditingAccount(null);
      }

      await loadAccounts();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete account. Please try again.",
        ),
      );
    }
  }

  async function loadAccounts() {
    try {
      setError(null);

      const response = await getAccounts();

      setAccounts(response.accounts);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to load accounts."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, []);

  if (isLoading) {
    return <p>Loading accounts...</p>;
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h2>Accounts</h2>
          <p>Manage your financial accounts.</p>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      <AccountForm
        account={editingAccount}
        onSaved={async () => {
          await loadAccounts();
          setEditingAccount(null);
        }}
        onCancel={() => setEditingAccount(null)}
      />

      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <h2>Your Accounts</h2>
        </div>

        {accounts.length === 0 ? (
          <p className="dashboard-empty">No accounts yet.</p>
        ) : (
          <div className="account-list">
            {accounts.map((account) => (
              <article className="account-card" key={account.id}>
                <div>
                  <h3>{account.name}</h3>
                  <p>{account.type}</p>
                </div>

                <div>
                  <strong>£{account.balance}</strong>

                  <div className="account-card__actions">
                    <button
                      type="button"
                      onClick={() => setEditingAccount(account)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(account)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
