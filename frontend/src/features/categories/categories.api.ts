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

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: CategoryType;
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

export async function createCategory(
  data: CreateCategoryRequest,
): Promise<CategoryResponse> {
  const response = await api.post<CategoryResponse>("/categories/", data);

  return response.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
): Promise<CategoryResponse> {
  const response = await api.patch<CategoryResponse>(`/categories/${id}`, data);

  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
