import type { Post } from '@/types/post';

export const MOCK_POSTS: Post[] = [
  {
    author: { avatarUrl: null, username: 'ivan.dev' },
    codeFilename: null,
    codeLanguage: null,
    codeSnippet: null,
    commentsCount: 34,
    content:
      'Che, probé el borrow checker en un proyecto grande por primera vez y la verdad que al principio duele, pero después te salva de mil bugs de concurrencia.',
    createdAt: new Date('2026-11-20T14:30:00'),
    id: 'mock-post-1',
    isOwnPost: false,
    likesCount: 218,
    sharesCount: 12,
    tags: [{ id: 'mock-tag-rust', label: 'rust' }],
    title: 'Un mes con Rust en producción',
    type: 'article',
  },
  {
    author: { avatarUrl: null, username: 'mica_codes' },
    codeFilename: 'main.rs',
    codeLanguage: 'rust',
    codeSnippet: `fn main() {
    let nums = vec![1, 2, 3];
    let sum: i32 = nums.iter().sum();
    println!("{sum}");
}`,
    commentsCount: 5,
    content: 'Snippet rapidito para sumar un vector sin loop manual.',
    createdAt: new Date('2026-11-21T09:15:00'),
    id: 'mock-post-2',
    isOwnPost: false,
    likesCount: 41,
    sharesCount: 3,
    tags: [
      { id: 'mock-tag-rust', label: 'rust' },
      { id: 'mock-tag-ia', label: 'ia' },
    ],
    title: 'Sumar con iteradores',
    type: 'snippet',
  },
  {
    author: { avatarUrl: null, username: 'iñaki' },
    codeFilename: null,
    codeLanguage: null,
    codeSnippet: null,
    commentsCount: 2,
    content: 'Este es mío, por eso no debería tener el botón de guardar.',
    createdAt: new Date('2026-11-22T18:00:00'),
    id: 'mock-post-3',
    isOwnPost: true,
    likesCount: 7,
    sharesCount: 0,
    tags: [{ id: 'mock-tag-rust', label: 'rust' }],
    title: 'Post propio de prueba',
    type: 'question',
  },
];
