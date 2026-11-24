import { z } from 'zod';

export const followUserSchema = z.object({
  idUser: z.string('Usuario requerido').uuid('ID de usuario inválido'),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;
