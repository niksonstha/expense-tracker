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

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await deleteCategory(category.id);

      if (editingCategory?.id === category.id) {
        setEditingCategory(undefined);
        setIsFormOpen(false);
      }

      await loadCategories();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to delete category. Please try again.",
        ),
      );
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
    return <p>Loading categories...</p>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage your income and expense categories.</p>
        </div>

        {!isFormOpen && (
          <Button type="button" onClick={handleAddCategory}>
            Add Category
          </Button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {isFormOpen && (
        <Card>
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

      <Card>
        <div className="card-header">
          <div>
            <h2>Your Categories</h2>
            <p>Income and expense categories</p>
          </div>
        </div>

        <CategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={(category) => void handleDelete(category)}
        />
      </Card>
    </div>
  );
}
