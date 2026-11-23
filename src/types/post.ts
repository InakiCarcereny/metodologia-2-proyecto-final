import type { Tag } from '@/types/tag';
import type { UserCardData } from '@/types/user';

export type PostType = 'article' | 'question' | 'snippet';

export interface Post {
  author: Pick<UserCardData, 'avatarUrl' | 'username'>;
  codeFilename: string | null;
  codeLanguage: string | null;
  codeSnippet: string | null;
  commentsCount: number;
  content: string;
  createdAt: Date;
  id: string;
  imageUrl: string | null;
  isPinned?: boolean;
  likesCount: number;
  repostedBy?: string;
  sharesCount: number;
  tags: Pick<Tag, 'id' | 'label'>[];
  title: string;
  type: PostType;
  viewer?: { bookmarked: boolean; liked: boolean; reposted: boolean };
}
