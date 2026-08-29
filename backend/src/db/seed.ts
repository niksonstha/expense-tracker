import 'dotenv/config';
import { db } from './index.js';
import { categories } from './schema.js';

const systemCategories = [
  {
    name: 'Food',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Transport',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Entertainment',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Shopping',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Rent',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Healthcare',
    type: 'EXPENSE' as const,
  },
  {
    name: 'Salary',
    type: 'INCOME' as const,
  },
];

async function seed() {
  console.log('Seeding system categories...');

  await db
    .insert(categories)
    .values(
      systemCategories.map((category) => ({
        userId: null,
        name: category.name,
        type: category.type,
      })),
    )
    .onConflictDoNothing();

  console.log('System categories seeded successfully.');

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
