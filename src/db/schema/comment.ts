import {
  type AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { posts } from './post';
import { users } from './user';

export const comments = pgTable('comments', {
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: serial('id').primaryKey(),
  idParent: integer('id_parent').references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade',
  }),
  idPost: integer('id_post')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
    }),
  idUser: integer('id_user').references(() => users.id, {
    onDelete: 'cascade',
  }),
});
