/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, FolderPlus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../lib/api-error";
import {
  createCategory,
  updateCategory,
  type Category,
  type CategoryType,
} from "./categories.api";

interface CategoryFormProps {
  category?: Category;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
}

export function CategoryForm({
  category,
  onSaved,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setName("");
      setType("EXPENSE");
    } else {
      setName(category.name);
      setType(category.type);
    }

    setError(null);
    document.getElementById("category-name")?.focus();
  }, [category]);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (category) {
        await updateCategory(category.id, {
          name: trimmedName,
          type,
        });
      } else {
        await createCategory({
          name: trimmedName,
          type,
        });
      }

      await onSaved();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          category
            ? "Unable to update category. Please try again."
            : "Unable to create category. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50";

  const labelStyles = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FolderPlus size={18} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {category ? "Edit Category" : "Add Category"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {category
              ? "Update the details of this category."
              : "Create a category to organize your finances."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category-name" className={labelStyles}>
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Groceries"
              maxLength={100}
              required
              disabled={isSubmitting}
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>Category Type</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                disabled={isSubmitting}
                className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  type === "EXPENSE"
                    ? "border-slate-300 bg-slate-100 text-slate-800 ring-1 ring-slate-200"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <ArrowUpRight size={18} />
                Expense
              </button>

              <button
                type="button"
                onClick={() => setType("INCOME")}
                disabled={isSubmitting}
                className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  type === "INCOME"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <ArrowDownLeft size={18} />
                Income
              </button>
            </div>

            <select
              id="category-type"
              value={type}
              onChange={(event) => setType(event.target.value as CategoryType)}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting
              ? "Saving..."
              : category
                ? "Update Category"
                : "Add Category"}
          </Button>
        </div>
      </form>
    </section>
  );
}
