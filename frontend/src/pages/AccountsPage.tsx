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
import {
  AlertTriangle,
  Banknote,
  CreditCard,
  Landmark,
  Wallet,
  X,
} from "lucide-react";

function formatAccountType(type: Account["type"]) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getAccountIcon(type: Account["type"]) {
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

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDelete() {
    if (!accountToDelete) {
      return;
    }

    try {
      setError(null);
      setIsDeleting(true);

      await deleteAccount(accountToDelete.id);

      if (editingAccount?.id === accountToDelete.id) {
        setEditingAccount(null);
        setIsFormOpen(false);
      }

      setAccountToDelete(null);

      await loadAccounts();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete account. Please try again.",
        ),
      );
    } finally {
      setIsDeleting(false);
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
    return (
      <section className="space-y-6 sm:space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Financial setup
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your bank accounts, savings, cash, and cards.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoadingMessage message="Loading accounts..." />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Financial setup
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your bank accounts, savings, cash, and cards.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            onClick={handleAddAccount}
            className="w-full sm:w-auto"
          >
            Add Account
          </Button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isFormOpen && (
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Your Accounts
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            View and manage your financial accounts.
          </p>
        </div>

        {accounts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No accounts yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Add your first account to start tracking your finances.
            </p>

            {!isFormOpen && (
              <button
                type="button"
                onClick={handleAddAccount}
                className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Add Account
              </button>
            )}
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {accounts.map((account) => {
                const Icon = getAccountIcon(account.type);

                return (
                  <article
                    key={account.id}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100 transition group-hover:bg-emerald-50 group-hover:ring-emerald-100">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {account.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {formatAccountType(account.type)}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        Active
                      </span>
                    </div>

                    <div className="mt-7">
                      <p className="text-xs font-medium text-slate-400">
                        Current balance
                      </p>

                      <strong className="mt-1 block text-2xl font-bold tracking-tight text-slate-900">
                        £{account.balance}
                      </strong>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-slate-200 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleEditAccount(account)}
                        className="flex-1 px-3 py-2 text-xs"
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setAccountToDelete(account)}
                        className="flex-1 px-3 py-2 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
      {accountToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="delete-account-title"
                      className="text-base font-semibold text-slate-900"
                    >
                      Delete account?
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      This action cannot be undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAccountToDelete(null)}
                    disabled={isDeleting}
                    aria-label="Close confirmation"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {accountToDelete.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatAccountType(accountToDelete.type)} · £
                    {accountToDelete.balance}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
