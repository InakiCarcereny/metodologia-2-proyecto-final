import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string('Correo requerido').email('Email inválido'),
  password: z
    .string('Contraseña requerida')
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  username: z.string('Usuario requerido').min(3, 'Mínimo 3 caracteres'),
});

export const loginSchema = z.object({
  email: z.string('Correo requerido').email('Email inválido'),
  password: z.string('Contraseña requerida'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
