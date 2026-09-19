import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { posts } from './post';
import { users } from './user';

export const postLikes = pgTable(
  'post_likes',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idPost: integer('id_post')
      .notNull()
      .references(() => posts.id, {
        onDelete: 'cascade',
      }),
    idUser: integer('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idPost, table.idUser] })],
);
