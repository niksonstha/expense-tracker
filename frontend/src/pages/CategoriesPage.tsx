/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { CategoryForm } from "../features/categories/CategoryForm";
import {
  deleteCategory,
  getCategories,
  type Category,
} from "../features/categories/categories.api";
import { getApiErrorMessage } from "../lib/api-error";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CategoryList } from "../features/categories/CategoryList";
import { LoadingMessage } from "../components/ui/LoadingMessage";
import { AlertTriangle, X } from "lucide-react";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadCategories() {
    setError(null);

    try {
      const response = await getCategories();
      setCategories(response.categories);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to load categories. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleDelete() {
    if (!categoryToDelete) {
      return;
    }

    try {
      setError(null);
      setIsDeleting(true);

      await deleteCategory(categoryToDelete.id);

      if (editingCategory?.id === categoryToDelete.id) {
        setEditingCategory(undefined);
        setIsFormOpen(false);
      }

      setCategoryToDelete(null);
      await loadCategories();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete category. Please try again.",
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleAddCategory() {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setEditingCategory(undefined);
    setIsFormOpen(false);
  }

  if (isLoading) {
    return (
      <section className="space-y-6 sm:space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Financial organization
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize your income and expenses with custom categories.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <LoadingMessage message="Loading categories..." />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Financial organization
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize your income and expenses with custom categories.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            onClick={handleAddCategory}
            className="w-full sm:w-auto"
          >
            Add Category
          </Button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {isFormOpen && (
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <CategoryForm
            category={editingCategory}
            onSaved={async () => {
              setEditingCategory(undefined);
              setIsFormOpen(false);
              await loadCategories();
            }}
            onCancel={handleCancelForm}
          />
        </Card>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Your Categories
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Income and expense categories
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <CategoryList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={(category) => setCategoryToDelete(category)}
          />
        </div>
      </section>

      {categoryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="delete-category-title"
                      className="text-base font-semibold text-slate-900 dark:text-white"
                    >
                      Delete category?
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      This action cannot be undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    disabled={isDeleting}
                    aria-label="Close confirmation"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {categoryToDelete.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {categoryToDelete.type === "INCOME"
                      ? "Income category"
                      : "Expense category"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
