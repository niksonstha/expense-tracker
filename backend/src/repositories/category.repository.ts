import { and, eq, isNull, or } from 'drizzle-orm';

import { db } from '../db/index.js';
import { categories } from '../db/schema.js';

export async function createCategory(data: {
  userId: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}) {
  const result = await db.insert(categories).values(data).returning();

  return result[0];
}

export async function findCategoriesByUserId(userId: string) {
  return db
    .select()
    .from(categories)
    .where(or(isNull(categories.userId), eq(categories.userId, userId)));
}

export async function findCategoryById(categoryId: string, userId: string) {
  const result = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        or(isNull(categories.userId), eq(categories.userId, userId)),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function updateCategoryById(
  categoryId: string,
  userId: string,
  data: {
    name?: string;
    type?: 'INCOME' | 'EXPENSE';
  },
) {
  const result = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning();

  return result[0] ?? null;
}

export async function deleteCategoryById(categoryId: string, userId: string) {
  const result = await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning({
      id: categories.id,
    });

  return result[0] ?? null;
}
