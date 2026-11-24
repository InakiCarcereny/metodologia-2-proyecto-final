import { Repeat2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX, ReactNode } from 'react';
import { PostCardCodeBlock } from '@/components/PostCardCodeBlock';
import { PostCardFooter } from '@/components/PostCardFooter';
import { PostCardHeader } from '@/components/PostCardHeader';
import { Separator } from '@/components/Separator';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { Post } from '@/types/post';
import { formatDisplayName } from '@/utils/format-display-name';

interface PostCardProps {
  linked?: boolean;
  post: Post;
}

export function PostCard({ linked = true, post }: PostCardProps): JSX.Element {
  const hasCode = post.type === 'snippet' && Boolean(post.codeSnippet);

  const body: ReactNode = (
    <>
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

      {post.imageUrl && (
        <Image
          alt="captura adjunta"
          className="h-auto w-full rounded-lg border border-[#dfe1e5]"
          height={338}
          src={post.imageUrl}
          width={600}
        />
      )}

      {hasCode && (
        <PostCardCodeBlock
          filename={post.codeFilename}
          language={post.codeLanguage}
          snippet={post.codeSnippet as string}
        />
      )}

      <Separator />

      <PostCardFooter post={post} />
    </>
  );

  if (!linked) {
    return (
      <CardWrapper as="article" className="flex flex-col gap-3">
        {body}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      as={Link}
      className="flex flex-col gap-3 hover:border-[#9b9ea5]"
      href={`/posts/${post.id}`}
    >
      {body}
    </CardWrapper>
  );
}
