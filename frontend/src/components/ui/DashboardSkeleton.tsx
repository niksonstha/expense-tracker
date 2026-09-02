export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-7 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="mt-5 h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />

          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />

          <div className="mx-auto mt-8 h-48 w-48 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800/60" />

          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-44 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                </div>
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
