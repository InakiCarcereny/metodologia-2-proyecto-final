import { describe, expect, it } from 'vitest';
import { createPostSchema, postInteractionSchema } from '../../schemas/post';

const validArticle = {
  content: 'Contenido del post',
  title: 'Un post válido',
  type: 'article' as const,
};

describe('createPostSchema', () => {
  it('accepts a valid article', () => {
    const result = createPostSchema.safeParse(validArticle);

    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      title: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('requires code and language for snippets', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      type: 'snippet',
    });

    expect(result.success).toBe(false);
  });

  it('rejects more than five tags', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      tags: ['one', 'two', 'three', 'four', 'five', 'six'],
    });

    expect(result.success).toBe(false);
  });

  it('accepts a complete snippet', () => {
    const result = createPostSchema.safeParse({
      ...validArticle,
      codeLanguage: 'typescript',
      codeSnippet: 'const answer = 42;',
      type: 'snippet',
    });

    expect(result.success).toBe(true);
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
