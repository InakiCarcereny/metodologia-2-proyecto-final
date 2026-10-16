import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const followers = pgTable(
  'followers',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idFollower: text('id_follower')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade', /// el que sigue
      }),
    idUser: text('id_user')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }), /// el usuario que es seguido
  },

  (table) => [primaryKey({ columns: [table.idFollower, table.idUser] })],
);
