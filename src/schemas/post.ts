import { z } from 'zod';
import { postTypes } from '@/db/schema';

export const createPostSchema = z
  .object({
    codeFilename: z
      .string('Nombre de archivo requerido')
      .trim()
      .max(100, 'Máximo 100 caracteres')
      .optional(),
    codeLanguage: z
      .string('Lenguaje requerido')
      .trim()
      .max(40, 'Máximo 40 caracteres')
      .optional(),
    codeSnippet: z
      .string('Código requerido')
      .trim()
      .max(10000, 'Máximo 10000 caracteres')
      .optional(),
    content: z
      .string('El post no puede estar vacío')
      .trim()
      .min(1, 'El post no puede estar vacío')
      .max(5000, 'Máximo 5000 caracteres'),
    type: z.enum(postTypes.enumValues, 'Tipo de post inválido'),
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'snippet') return;

    if (!data.codeSnippet) {
      ctx.addIssue({
        code: 'custom',
        message: 'Un snippet necesita código',
        path: ['codeSnippet'],
      });
    }

    if (!data.codeLanguage) {
      ctx.addIssue({
        code: 'custom',
        message: 'Un snippet necesita lenguaje',
        path: ['codeLanguage'],
      });
    }
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;
