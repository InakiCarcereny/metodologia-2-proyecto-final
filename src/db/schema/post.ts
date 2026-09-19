import { pgTable, serial } from 'drizzle-orm/pg-core';
import { users } from '../schema/user';

export const userPosts = pgTable('user_posts', {
  id: serial('id').primaryKey(),
  idUser: serial('id_user').references(() => users.id, {
    onDelete: 'set null',
  }),
});
