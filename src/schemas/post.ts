import { z } from 'zod';

export const createPostSchema = z.object({});

export type CreatePostInput = z.infer<typeof createPostSchema>;
