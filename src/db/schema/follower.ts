import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';

export const followers = pgTable(
  'followers',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    idFollower: integer('id_follower')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade', /// el que sigue
      }),
    idUser: integer('id_user')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }), /// el usuario que es seguido
  },

  (table) => [primaryKey({ columns: [table.idFollower, table.idUser] })],
);
