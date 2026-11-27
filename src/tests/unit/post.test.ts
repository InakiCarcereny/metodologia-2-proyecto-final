import { describe, expect, it } from 'vitest';
import { createPostSchema, postInteractionSchema } from '../../schemas/post';

const validArticle = {
  content: 'Contenido del post',
  title: 'Un post válido',
  type: 'article' as const,
};

const validSnippet = {
  codeLanguage: 'typescript',
  codeSnippet: 'const value = 42;',
  content: 'Contenido del snippet',
  title: 'Un snippet válido',
  type: 'snippet' as const,
};

describe('createPostSchema', () => {
  it('accepts a valid article', () => {
    const result = createPostSchema.safeParse(validArticle);

    expect(result.success).toBe(true);
  });

  it('accepts a valid snippet', () => {
    const result = createPostSchema.safeParse(validSnippet);

    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      title: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a snippet without code', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeSnippet: undefined,
    });

    expect(result.success).toBe(false);
  });

  it('rejects a snippet without language', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeLanguage: undefined,
    });

    expect(result.success).toBe(false);
  });

  it('rejects a snippet with empty code', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeSnippet: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a snippet with empty language', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeLanguage: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('accepts code with exactly 10000 characters', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeSnippet: 'a'.repeat(10000),
    });

    expect(result.success).toBe(true);
  });

  it('rejects code with more than 10000 characters', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeSnippet: 'a'.repeat(10001),
    });

    expect(result.success).toBe(false);
  });

  it('accepts a language with exactly 40 characters', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeLanguage: 'a'.repeat(40),
    });

    expect(result.success).toBe(true);
  });

  it('rejects a language with more than 40 characters', () => {
    const result = createPostSchema.safeParse({
      ...validSnippet,
      codeLanguage: 'a'.repeat(41),
    });

    expect(result.success).toBe(false);
  });

  it('accepts exactly five tags', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      tags: ['one', 'two', 'three', 'four', 'five'],
    });

    expect(result.success).toBe(true);
  });

  it('rejects more than five tags', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      tags: ['one', 'two', 'three', 'four', 'five', 'six'],
    });

    expect(result.success).toBe(false);
  });
});

describe('postInteractionSchema', () => {
  it('accepts a valid post UUID', () => {
    const result = postInteractionSchema.safeParse({
      idPost: '123e4567-e89b-12d3-a456-426614174000',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid post ID', () => {
    const result = postInteractionSchema.safeParse({
      idPost: 'not-a-uuid',
    });

    expect(result.success).toBe(false);
  });
});
