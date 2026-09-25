import { z } from 'zod';

export const postTypeEnum = z.enum(['snippet', 'article', 'question']);

export const createPostSchema = z.object({
  codeFilename: z.string().max(255).optional(),
  codeLanguage: z.string().max(50).optional(),
  codeSnippet: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
  title: z.string().min(1).max(200),
  type: postTypeEnum.default('snippet'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
