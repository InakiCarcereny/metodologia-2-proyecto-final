import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  description: text('description'),
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull().unique(),
});
