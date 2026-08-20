import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  unique,
} from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', [
  'BANK',
  'SAVINGS',
  'CASH',
  'CREDIT_CARD',
]);

export const categoryTypeEnum = pgEnum('category_type', ['INCOME', 'EXPENSE']);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'INCOME',
  'EXPENSE',
  'TRANSFER',
]);

export const transactionDirectionEnum = pgEnum('transaction_direction', [
  'IN',
  'OUT',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', {
    length: 100,
  }).notNull(),

  email: varchar('email', {
    length: 255,
  })
    .notNull()
    .unique(),

  passwordHash: text('password_hash').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  name: varchar('name', {
    length: 100,
  }).notNull(),

  type: accountTypeEnum('type').notNull(),

  initialBalance: numeric('initial_balance', {
    precision: 12,
    scale: 2,
  })
    .notNull()
    .default('0'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),

    name: varchar('name', {
      length: 100,
    }).notNull(),

    type: categoryTypeEnum('type').notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    unique('categories_user_name_unique').on(table.userId, table.name),
  ],
);

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, {
      onDelete: 'cascade',
    }),

  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),

  type: transactionTypeEnum('type').notNull(),

  direction: transactionDirectionEnum('direction').notNull(),

  amount: numeric('amount', {
    precision: 12,
    scale: 2,
  }).notNull(),

  description: varchar('description', {
    length: 500,
  }),

  transactionDate: timestamp('transaction_date', {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
