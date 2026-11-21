import { z } from 'zod';

export const editProfileSchema = z.object({
  bio: z
    .string()
    .max(160, 'Máximo 160 caracteres')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(50, 'Máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .max(100, 'Máximo 100 caracteres')
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^https?:\/\/.+/.test(value), {
      message: 'Debe empezar con http:// o https://',
    }),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
