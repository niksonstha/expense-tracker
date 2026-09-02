import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import { useTheme } from "../hooks/useTheme";


const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/accounts": "Accounts",
  "/categories": "Categories",
  "/transfers": "Transfers",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const title = pageTitles[location.pathname] ?? "Expense Tracker";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>

            {location.pathname === "/dashboard" && (
              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Here's your financial overview.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>

          <div className="ml-1 hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

          <div className="ml-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.name ?? "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
