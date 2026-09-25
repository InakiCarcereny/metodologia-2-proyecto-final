import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts, users } from '@/db/schema';

export const bookmarks = pgTable(
  'bookmarks',
  {
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    idPost: uuid('id_post')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    idUser: uuid('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idUser, table.idPost] })],
);
