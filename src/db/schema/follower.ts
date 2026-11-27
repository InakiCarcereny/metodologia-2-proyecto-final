import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const followers = pgTable(
  'followers',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idFollower: uuid('id_follower')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade', /// el que sigue
      }),
    idUser: uuid('id_user')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }), /// el usuario que es seguido
  },

  (table) => [primaryKey({ columns: [table.idFollower, table.idUser] })],
);
