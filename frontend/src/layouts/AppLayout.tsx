import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/auth.context";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <h1>Expense Tracker</h1>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div>
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
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
