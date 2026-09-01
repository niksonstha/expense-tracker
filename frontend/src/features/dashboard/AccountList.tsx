import type { DashboardAccount } from "./dashboard.api";

interface AccountListProps {
  accounts: DashboardAccount[];
}

export function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return <p>No accounts yet.</p>;
  }

  return (
    <section>
      <h2>Accounts</h2>

      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <strong>{account.name}</strong>
            <span>
              {" "}
              — {account.type} — £{account.balance}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
