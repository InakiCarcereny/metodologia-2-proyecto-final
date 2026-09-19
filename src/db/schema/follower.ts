import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../schema/user';

export const followers = pgTable('followers', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  idFollower: serial('id_follower').references(() => users.id, {
    onDelete: 'cascade', /// el que sigue
  }),
  idUser: serial('id_user').references(() => users.id, {
    onDelete: 'cascade',
  }), /// el usuario que es seguido
});
