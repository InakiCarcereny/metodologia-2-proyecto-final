import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { comments } from '../schema/comment';
import { users } from '../schema/user';

export const commentLikes = pgTable('comment_likes', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  idComment: serial('id_comment').references(() => comments.id, {
    onDelete: 'cascade',
  }),
  idUser: serial('id_user').references(() => users.id, {
    onDelete: 'cascade',
  }),
});
