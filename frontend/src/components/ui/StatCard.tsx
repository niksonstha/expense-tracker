interface StatCardProps {
  title: string;
  value: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <strong>{value}</strong>
    </article>
  );
}
