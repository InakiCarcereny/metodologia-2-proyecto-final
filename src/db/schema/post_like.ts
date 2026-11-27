import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts, users } from '@/db/schema';

export const postLikes = pgTable(
  'post_likes',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idPost: uuid('id_post')
      .notNull()
      .references(() => posts.id, {
        onDelete: 'cascade',
      }),
    idUser: uuid('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idPost, table.idUser] })],
);
