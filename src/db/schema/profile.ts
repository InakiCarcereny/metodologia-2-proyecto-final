import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';

export const profiles = pgTable('profiles', {
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  id: integer('id_user')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  location: text('location'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
