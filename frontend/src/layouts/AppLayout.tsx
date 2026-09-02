import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/auth.context";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/dashboard" className="app-brand">
            Expense Tracker
          </Link>

          <nav className="app-nav" aria-label="Main navigation">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/accounts">Accounts</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/transfers">Transfers</NavLink>
          </nav>

          <div className="app-user">
            <span>Welcome, {user?.name ?? "User"}</span>

            <button
              type="button"
              aria-label="Log out of your account"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
