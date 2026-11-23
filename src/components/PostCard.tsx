import { Repeat2 } from 'lucide-react';
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
    <CardWrapper as="article" className="flex flex-col gap-3">
      {post.repostedBy && (
        <p className="flex items-center gap-1 font-light text-[#7e8288] text-xs">
          <Repeat2 size={12} />
          Reposteado por {formatDisplayName(post.repostedBy)}
        </p>
      )}

      <PostCardHeader post={post} />

      <p className="whitespace-pre-wrap font-sans text-[#494d56] text-[13px] leading-[1.5]">
        {post.content}
      </p>

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
