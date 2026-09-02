export function TransactionSkeleton() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

            <div className="min-w-0 space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="hidden gap-2 sm:flex">
              <div className="h-9 w-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
              <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
