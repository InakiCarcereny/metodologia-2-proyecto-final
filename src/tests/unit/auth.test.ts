import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '../../schemas/auth';

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
      username: 'developer',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a password without the required format', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'password',
      username: 'developer',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a username shorter than three characters', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
      username: 'ab',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'any-password',
    });

    expect(result.success).toBe(false);
  });
});
