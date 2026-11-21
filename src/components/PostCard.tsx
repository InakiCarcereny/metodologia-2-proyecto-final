import Image from 'next/image';
import type { JSX } from 'react';
import type { FeedPost } from '@/db/queries/posts';
import { timeAgo } from '@/utils/time-ago';
import { CodeBlock } from './CodeBlock';
import { PostActions } from './PostActions';
import { TypePill } from './TypePill';
import { CardWrapper } from './ui/CardWrapper';

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post }: PostCardProps): JSX.Element {
  return (
    <CardWrapper as="article" className="flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image
            alt={post.author.username}
            className="rounded-[10px]"
            height={36}
            loading="eager"
            src={post.author.avatarUrl ?? '/tired-totoro.jpg'}
            unoptimized
            width={42}
          />

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[14px]">
                {post.author.username}
              </span>
              <span className="text-[#676b72] text-[12px]">
                @{post.author.username}
              </span>
            </div>

            <small className="font-mono text-[#878992] text-[12px]">
              {timeAgo(post.createdAt)}
              {/* tags go here once post_tags lands */}
            </small>
          </div>
        </div>

        <TypePill type={post.type} />
      </header>

      <p className="whitespace-pre-wrap font-sans text-[#494d56] text-[13px] leading-[1.5]">
        {post.content}
      </p>

      {post.codeSnippet && (
        <CodeBlock
          code={post.codeSnippet}
          filename={post.codeFilename}
          language={post.codeLanguage}
        />
      )}

      <footer className="border-[#dfe1e5] border-t pt-3">
        <PostActions idPost={post.id} stats={post.stats} viewer={post.viewer} />
      </footer>
    </CardWrapper>
  );
}
