import { Button } from "../../components/ui/Button";
import type { Category } from "./categories.api";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (categories.length === 0) {
    return <p className="dashboard-empty">No categories yet.</p>;
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <article className="category-row" key={category.id}>
          <div>
            <h3>{category.name}</h3>

            <span
              className={`category-type category-type--${category.type.toLowerCase()}`}
            >
              {category.type}
            </span>
          </div>

          <div className="category-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onEdit(category)}
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(category)}
            >
              Delete
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
