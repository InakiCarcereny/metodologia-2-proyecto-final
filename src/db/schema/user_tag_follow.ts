import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { tags } from './tag';
import { users } from './user';

export const userTagFollows = pgTable(
  'user_tag_follows',
  {
    followedAt: timestamp('followed_at').notNull().defaultNow(),
    idTag: uuid('id_tag')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    idUser: uuid('id_user')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.idTag, table.idUser] })],
);
