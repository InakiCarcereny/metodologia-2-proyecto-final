import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { tags, users } from '@/db/schema';

export const userTagFollows = pgTable(
  'user_tag_follows',
  {
    followedAt: timestamp('followed_at').notNull().defaultNow(),
    idTag: uuid('id_tag')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    idUser: text('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idTag, table.idUser] })],
);
