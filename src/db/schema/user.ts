import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
