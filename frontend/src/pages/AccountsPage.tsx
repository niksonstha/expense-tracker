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
  Banknote,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
  WalletCards,
} from "lucide-react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

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
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Financial setup
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your bank accounts, savings, cash, and cards.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <LoadingMessage message="Loading accounts..." />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Financial setup
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {isFormOpen && (
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
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

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Your Accounts
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            View and manage your financial accounts.
          </p>
        </div>

        {accounts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <WalletCards size={24} />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No accounts yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400 dark:text-slate-500">
              Add your first bank account, savings account, or card to start
              tracking your finances.
            </p>

            {!isFormOpen && (
              <button
                type="button"
                onClick={handleAddAccount}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <Plus size={17} />
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
                    className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100 transition group-hover:bg-emerald-50 group-hover:ring-emerald-100 dark:bg-slate-900 dark:text-emerald-400 dark:ring-slate-800 dark:group-hover:bg-emerald-950/50 dark:group-hover:ring-emerald-900/50">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {account.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {formatAccountType(account.type)}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Active
                      </span>
                    </div>

                    <div className="mt-7">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Current balance
                      </p>

                      <strong className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        £{account.balance}
                      </strong>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
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

      <ConfirmDialog
        open={Boolean(accountToDelete)}
        title="Delete account?"
        description={
          accountToDelete
            ? `Delete "${accountToDelete.name}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete account"
        isLoading={isDeleting}
        onCancel={() => setAccountToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
