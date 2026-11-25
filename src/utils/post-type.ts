import type { PostType } from '@/types/post';

export const POST_TYPE_LABELS: Record<PostType, string> = {
  article: 'artículo',
  question: 'pregunta',
  snippet: 'snippet',
};

export const POST_TYPE_STYLES: Record<PostType, string> = {
  article: 'bg-[#eaf1fd] text-[#3b6fd4]',
  question: 'bg-[#f3ecfb] text-[#8a4fd1]',
  snippet: 'bg-[#fdecea] text-[#c0392b]',
};
