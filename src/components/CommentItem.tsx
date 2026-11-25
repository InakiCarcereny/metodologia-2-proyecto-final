'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { CommentForm } from '@/components/CommentForm';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import type { CommentThread } from '@/db/queries/comments';
import { formatDisplayName } from '@/utils/format-display-name';
import { formatRelativeTime } from '@/utils/format-relative-time';

interface CommentItemProps {
  comment: CommentThread;
  idPost: string;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  idPost,
  isReply = false,
}: CommentItemProps): JSX.Element {
  const [replying, setReplying] = useState(false);

  return (
    <li
      className={
        isReply
          ? 'flex flex-col gap-2 border-[#dfe1e5] border-l pl-4'
          : 'flex flex-col gap-3 rounded-lg border border-[#dfe1e5] p-4'
      }
    >
      <div className="flex items-start gap-3">
        <PostCardAvatar
          avatarUrl={comment.author.avatarUrl}
          username={comment.author.username}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-[#171b22] text-[13px]">
              {formatDisplayName(comment.author.username)}
            </span>

            <span className="font-light text-[#7e8288] text-[12px]">
              @{comment.author.username}
            </span>

            <span className="font-light text-[#7e8288] text-[12px]">
              · {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="whitespace-pre-wrap font-sans text-[#494d56] text-[13px] leading-relaxed">
            {comment.content}
          </p>

          <button
            className="w-fit cursor-pointer font-medium text-[#7e8288] text-[12px] transition-colors hover:text-[#171b22]"
            onClick={() => setReplying((previous) => !previous)}
            type="button"
          >
            Responder
          </button>
        </div>
      </div>

      {replying && (
        <div className="pl-11">
          <CommentForm
            idParent={comment.id}
            idPost={idPost}
            onDone={() => setReplying(false)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <ul className="ml-11 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <CommentItem
              comment={reply}
              idPost={idPost}
              isReply
              key={reply.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
