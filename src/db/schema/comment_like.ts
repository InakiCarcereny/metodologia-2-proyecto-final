import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { comments, users } from '@/db/schema';

export const commentLikes = pgTable(
  'comment_likes',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idComment: uuid('id_comment')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    idUser: text('id_user')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({ columns: [table.idComment, table.idUser] })],
);
