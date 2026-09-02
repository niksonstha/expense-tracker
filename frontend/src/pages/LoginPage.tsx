import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await login({
        email: email.trim(),
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
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">ET</div>

          <div>
            <h1>Welcome back</h1>
            <p>Sign in to manage your expenses.</p>
          </div>
        </div>

        {registered && (
          <p className="auth-success" role="status">
            Account created successfully. You can now log in.
          </p>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <div className="auth-field__label">
              <label htmlFor="password">Password</label>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
}
