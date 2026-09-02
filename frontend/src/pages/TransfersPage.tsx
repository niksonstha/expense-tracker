import { useState } from "react";
import { ArrowRightLeft, Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TransferForm } from "../features/transfers/TransferForm";
import { useToast } from "../components/ui/ToastProvider";

export function TransfersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toast = useToast();

  function handleAddTransfer() {
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setIsFormOpen(false);
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Money movement
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Transfers
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Move money securely between your accounts.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            onClick={handleAddTransfer}
            className="w-full sm:w-auto"
          >
            Add Transfer
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <TransferForm
            onSaved={async () => {
              toast.success("Transfer created successfully");
              setIsFormOpen(false);
            }}
            onCancel={handleCancelForm}
          />
        </Card>
      )}

      {!isFormOpen && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Account Transfers
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Move money from one of your accounts to another.
              </p>
            </div>
          </div>

          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ArrowRightLeft size={24} />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Ready to move money?
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400 dark:text-slate-500">
              Move money between your accounts without recording it as income or
              an expense.
            </p>

            <button
              type="button"
              onClick={handleAddTransfer}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              <Plus size={17} />
              Add Transfer
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
