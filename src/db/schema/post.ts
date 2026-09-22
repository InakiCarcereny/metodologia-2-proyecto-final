import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const postTypes = pgEnum('post_type', [
  'snippet',
  'article',
  'question',
]);

export const posts = pgTable(
  'posts',
  {
    codeFilename: text('code_filename'),
    codeLanguage: text('code_language'),
    codeSnippet: text('code_snippet'),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: serial('id').primaryKey(),
    idUser: integer('id_user').references(() => users.id, {
      onDelete: 'set null',
    }),
    imageUrl: text('image_url'),
    title: text('title').notNull(),
    type: postTypes('type').notNull().default('snippet'),
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
