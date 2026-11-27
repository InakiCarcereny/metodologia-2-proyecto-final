import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string('El comentario no puede estar vacío')
    .trim()
    .min(1, 'El comentario no puede estar vacío')
    .max(2000, 'Máximo 2000 caracteres'),
  idParent: z
    .string('Comentario padre requerido')
    .uuid('ID de comentario inválido')
    .optional(),
  idPost: z.string('Post requerido').uuid('ID de post inválido'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
