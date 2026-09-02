import { ArrowDownLeft, ArrowUpRight, FolderOpen } from "lucide-react";
import { Button } from "../../components/ui/Button";
import type { Category } from "./categories.api";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function formatCategoryType(type: Category["type"]) {
  return type === "INCOME" ? "Income" : "Expense";
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-6 py-14 text-center">
        <FolderOpen size={30} className="mx-auto text-slate-300" />

        <p className="mt-3 text-sm font-semibold text-slate-700">
          No categories yet
        </p>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
          Create categories to keep your income and expenses organized.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const isIncome = category.type === "INCOME";
        const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

        return (
          <article
            key={category.id}
            className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isIncome
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {category.name}
              </h3>

              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  isIncome
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {formatCategoryType(category.type)}
              </span>
            </div>

            <div className="flex shrink-0 gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onEdit(category)}
                aria-label={`Edit ${category.name}`}
                className="px-2.5 py-2 text-xs"
              >
                Edit
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={() => onDelete(category)}
                aria-label={`Delete ${category.name}`}
                className="px-2.5 py-2 text-xs"
              >
                Delete
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
