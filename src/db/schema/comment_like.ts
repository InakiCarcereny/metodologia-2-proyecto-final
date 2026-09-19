import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { comments } from './comment';
import { users } from './user';

export const commentLikes = pgTable(
  'comment_likes',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idComment: integer('id_comment')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    idUser: integer('id_user')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({ columns: [table.idComment, table.idUser] })],
);
