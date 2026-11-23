import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts, tags } from '@/db/schema';

export const postTags = pgTable(
  'post_tags',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idPost: uuid('id_post')
      .notNull()
      .references(() => posts.id, {
        onDelete: 'cascade',
      }),
    idTag: uuid('id_tag')
      .notNull()
      .references(() => tags.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({ columns: [table.idPost, table.idTag] })],
);
