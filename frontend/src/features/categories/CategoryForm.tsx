/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
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
      return;
    }

    setName(category.name);
    setType(category.type);
  }, [category]);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      if (category) {
        await updateCategory(category.id, {
          name: name.trim(),
          type,
        });
      } else {
        await createCategory({
          name: name.trim(),
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

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{category ? "Edit Category" : "Add Category"}</h2>

      {error && <p className="form-error">{error}</p>}

      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Groceries"
          maxLength={100}
          required
        />
      </label>

      <label>
        Type
        <select
          value={type}
          onChange={(event) => setType(event.target.value as CategoryType)}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </label>

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : category
              ? "Update Category"
              : "Add Category"}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
