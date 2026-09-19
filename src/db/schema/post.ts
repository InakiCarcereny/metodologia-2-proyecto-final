import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const posts = pgTable(
  'posts',
  {
    codeLanguage: text('code_language'),
    codeSnippet: text('code_snippet'),
    content: text('content').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: serial('id').primaryKey(),
    idUser: integer('id_user').references(() => users.id, {
      onDelete: 'cascade',
    }),
    imageUrl: text('image_url'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('posts_user_idx').on(table.idUser),
    index('posts_created_at_idx').on(table.createdAt),
  ],
);
