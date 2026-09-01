import { api } from "../../services/api";

export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  category: Category;
}

export interface CategoriesResponse {
  categories: Category[];
}

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await api.get<CategoriesResponse>("/categories/");

  return response.data;
}

export async function getCategory(id: string): Promise<CategoryResponse> {
  const response = await api.get<CategoryResponse>(`/categories/${id}`);

  return response.data;
}
