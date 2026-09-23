import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  email: text('email').notNull().unique(),
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  username: text('username').notNull().unique(),
});
