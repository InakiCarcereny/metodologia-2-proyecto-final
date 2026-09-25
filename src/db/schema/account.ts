import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { users } from '@/db/schema';

export const accounts = pgTable(
  'accounts',
  {
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    id_token: text('id_token'),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    scope: text('scope'),
    session_state: text('session_state'),
    token_type: text('token_type'),
    type: text('type').$type<AdapterAccountType>().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);
