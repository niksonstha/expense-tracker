import type { DashboardAccount } from "./dashboard.api";

interface AccountListProps {
  accounts: DashboardAccount[];
}

function formatAccountType(type: DashboardAccount["type"]) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function AccountList({ accounts }: AccountListProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <h2>Accounts</h2>
      </div>

      {accounts.length === 0 ? (
        <p className="dashboard-empty">No accounts yet.</p>
      ) : (
        <div className="account-list">
          {accounts.map((account) => (
            <article className="account-card" key={account.id}>
              <div>
                <h3>{account.name}</h3>
                <p>{formatAccountType(account.type)}</p>
              </div>

              <strong>£{Number(account.balance).toFixed(2)}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
