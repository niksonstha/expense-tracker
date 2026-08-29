import {
  createCategory,
  deleteCategoryById,
  findCategoriesByUserId,
  findCategoryById,
  updateCategoryById,
} from '../repositories/category.repository.js';

export async function createUserCategory(data: {
  userId: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}) {
  return createCategory(data);
}

export async function getUserCategories(userId: string) {
  return findCategoriesByUserId(userId);
}

export async function getUserCategory(categoryId: string, userId: string) {
  return findCategoryById(categoryId, userId);
}

export async function updateUserCategory(
  categoryId: string,
  userId: string,
  data: {
    name?: string;
    type?: 'INCOME' | 'EXPENSE';
  },
) {
  return updateCategoryById(categoryId, userId, data);
}

export async function deleteUserCategory(categoryId: string, userId: string) {
  return deleteCategoryById(categoryId, userId);
}
