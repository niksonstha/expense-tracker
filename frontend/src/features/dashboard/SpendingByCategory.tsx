import type { DashboardSpending } from "./dashboard.api";

interface SpendingByCategoryProps {
  spending: DashboardSpending[];
  total: string;
}

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

export function SpendingByCategory({
  spending,
  total,
}: SpendingByCategoryProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <h2>Spending by Category</h2>
      </div>

      {spending.length === 0 ? (
        <p className="dashboard-empty">No spending recorded this month.</p>
      ) : (
        <>
          <p className="spending-total">
            Total: <strong>{formatCurrency(total)}</strong>
          </p>

          <div className="spending-list">
            {spending.map((item) => (
              <div className="spending-row" key={item.categoryId}>
                <div className="spending-row__info">
                  <span>{item.category}</span>

                  <strong>{Number(item.percentage).toFixed(1)}%</strong>
                </div>

                <div className="spending-bar">
                  <div
                    className="spending-bar__fill"
                    style={{
                      width: `${Math.min(Math.max(Number(item.percentage), 0), 100)}%`,
                    }}
                  />
                </div>

                <span className="spending-row__amount">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
