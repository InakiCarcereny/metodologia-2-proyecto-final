import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  passwordHash: text('password_hash'),
  username: text('username').notNull().unique(),
});
