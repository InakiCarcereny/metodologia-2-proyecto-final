import type { InferSelectModel } from 'drizzle-orm';
import type { profiles } from '@/db/schema';

export type Profile = InferSelectModel<typeof profiles>;
