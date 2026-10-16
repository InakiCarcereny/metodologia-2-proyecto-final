import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { posts, users } from '@/db/schema';

export const postShares = pgTable(
  'post_shares',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idPost: uuid('id_post')
      .notNull()
      .references(() => posts.id, {
        onDelete: 'cascade',
      }),
    idUser: text('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idPost, table.idUser] })],
);
