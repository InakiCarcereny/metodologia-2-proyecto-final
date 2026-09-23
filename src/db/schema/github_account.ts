import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';

export const githubAccounts = pgTable('github_accounts', {
  accessToken: text('access_token').notNull(),
  githubId: integer('github_id').notNull().unique(),
  githubUsername: text('github_username').notNull(),
  idUser: uuid('id_user')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  linkedAt: timestamp('linked_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
