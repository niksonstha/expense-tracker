import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import { getApiErrorMessage } from "../lib/api-error";


interface LoginLocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const registered = (location.state as { registered?: boolean } | null)
    ?.registered;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });

      const state = location.state as LoginLocationState | null;
      const destination = state?.from?.pathname ?? "/dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Unable to log in. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Expense Tracker</h1>

      <h2>Login</h2>

      {registered && (
        <p role="status">Account created successfully. You can now log in.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
