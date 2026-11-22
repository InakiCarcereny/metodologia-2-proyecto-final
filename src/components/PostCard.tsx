import { Repeat2 } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { PostCardCodeBlock } from '@/components/PostCardCodeBlock';
import { PostCardFooter } from '@/components/PostCardFooter';
import { PostCardHeader } from '@/components/PostCardHeader';
import { Separator } from '@/components/Separator';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { Post } from '@/types/post';
import { formatDisplayName } from '@/utils/format-display-name';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): JSX.Element {
  const hasCode = post.type === 'snippet' && Boolean(post.codeSnippet);

  return (
    <CardWrapper
      as={Link}
      className="flex flex-col gap-3 hover:border-[#9b9ea5]"
      href={`/posts/${post.id}`}
    >
      {post.repostedBy && (
        <p className="flex items-center gap-1 font-light text-[#7e8288] text-xs">
          <Repeat2 size={12} />
          Reposteado por {formatDisplayName(post.repostedBy)}
        </p>
      )}

      <PostCardHeader post={post} />

      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-[15px]">{post.title}</h3>

        <p className="font-light text-[#44474c] text-[14px]">{post.content}</p>
      </div>

      {hasCode && (
        <PostCardCodeBlock
          filename={post.codeFilename}
          language={post.codeLanguage}
          snippet={post.codeSnippet as string}
        />
      )}

      <Separator />

      <PostCardFooter post={post} />
    </CardWrapper>
  );
}
