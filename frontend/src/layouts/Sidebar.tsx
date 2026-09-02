import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: List,
  },
  {
    label: "Accounts",
    to: "/accounts",
    icon: Wallet,
  },
  {
    label: "Categories",
    to: "/categories",
    icon: Tags,
  },
  {
    label: "Transfers",
    to: "/transfers",
    icon: CreditCard,
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
            ET
          </div>

          <span className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Expense Tracker
          </span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Overview
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.3 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Insights
          </p>

          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 dark:text-slate-600">
            <BarChart3 size={18} />

            <span>Analytics</span>

            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-900 dark:text-slate-600">
              Soon
            </span>
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <NavLink
          to="/dashboard"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-500">
              {user?.email ?? ""}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
