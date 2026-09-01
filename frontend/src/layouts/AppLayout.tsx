import { Link, Outlet, useNavigate } from "react-router-dom";

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

          <nav className="app-nav">
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <div className="app-user">
            <span>Welcome, {user?.name}</span>

            <button
              type="button"
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
