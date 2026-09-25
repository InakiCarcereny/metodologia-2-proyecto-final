import {
  type AnyPgColumn,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { posts, users } from '@/db/schema';

export const comments = pgTable('comments', {
  codeLine: text('code_line'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id').primaryKey().defaultRandom(),
  idParent: uuid('id_parent').references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade',
  }),
  idPost: uuid('id_post')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
    }),
  idUser: text('id_user').references(() => users.id, {
    onDelete: 'set null',
  }),
});
