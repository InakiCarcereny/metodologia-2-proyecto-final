import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { userPosts } from './post';
import { users } from './user';

export const postShares = pgTable('post_shares', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  idPost: serial('id_post').references(() => userPosts.id, {
    onDelete: 'cascade',
  }),
  idUser: serial('id_user').references(() => users.id, { onDelete: 'cascade' }),
});
