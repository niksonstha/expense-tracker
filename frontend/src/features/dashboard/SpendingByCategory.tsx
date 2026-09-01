import type { DashboardSpending } from "./dashboard.api";

interface SpendingByCategoryProps {
  spending: DashboardSpending[];
  total: string;
}

export function SpendingByCategory({
  spending,
  total,
}: SpendingByCategoryProps) {
  if (spending.length === 0) {
    return (
      <section>
        <h2>Spending by Category</h2>
        <p>No spending recorded this month.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Spending by Category</h2>

      <p>Total: £{total}</p>

      <ul>
        {spending.map((item) => (
          <li key={item.categoryId}>
            <strong>{item.category}</strong>

            <span>
              {" "}
              — £{item.amount} ({item.percentage}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
