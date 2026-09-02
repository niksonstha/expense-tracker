/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  deleteAccount,
  getAccounts,
  type Account,
} from "../features/accounts/accounts.api";
import { getApiErrorMessage } from "../lib/api-error";
import { AccountForm } from "../features/accounts/AccountForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingMessage } from "../components/ui/LoadingMessage";

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        setIsFormOpen(false);
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

  function handleAddAccount() {
    setEditingAccount(null);
    setIsFormOpen(true);
  }

  function handleEditAccount(account: Account) {
    setEditingAccount(account);
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setEditingAccount(null);
    setIsFormOpen(false);
  }

  if (isLoading) {
    return <LoadingMessage message="Loading accounts..." />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Accounts</h1>
          <p>Manage your financial accounts.</p>
        </div>

        {!isFormOpen && (
          <Button type="button" onClick={handleAddAccount}>
            Add Account
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
          <AccountForm
            account={editingAccount}
            onSaved={async () => {
              await loadAccounts();
              setEditingAccount(null);
              setIsFormOpen(false);
            }}
            onCancel={handleCancelForm}
          />
        </Card>
      )}

      <Card className="dashboard-section">
        <div className="dashboard-section__header">
          <div>
            <h2>Your Accounts</h2>
            <p>View and manage your financial accounts.</p>
          </div>
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEditAccount(account)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => void handleDelete(account)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
