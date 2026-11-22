import type { JSX } from 'react';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types/post';

interface PostListProps {
  emptyMessage: string;
  posts: Post[];
}

export function PostList({ emptyMessage, posts }: PostListProps): JSX.Element {
  if (posts.length === 0) {
    return (
      <p className="text-center font-light text-[#7e8288] text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
