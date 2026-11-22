import type { InferSelectModel } from 'drizzle-orm';
import type { tags } from '@/db/schema';

export type Tag = InferSelectModel<typeof tags>;
