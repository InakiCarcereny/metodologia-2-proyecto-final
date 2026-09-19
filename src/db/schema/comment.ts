import {
  type AnyPgColumn,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { userPosts } from './post';
import { users } from './user';

export const comments = pgTable('comments', {
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: serial('id').primaryKey(),
  idParent: serial('id_parent').references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade',
  }),
  idPost: serial('id_post').references(() => userPosts.id, {
    onDelete: 'cascade',
  }),
  idUser: serial('id_user').references(() => users.id, { onDelete: 'cascade' }),
});
