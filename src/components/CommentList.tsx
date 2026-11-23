import type { JSX } from 'react';
import { CommentItem } from '@/components/CommentItem';
import type { CommentThread } from '@/db/queries/comments';

interface CommentListProps {
  idPost: string;
  threads: CommentThread[];
}

export function CommentList({
  idPost,
  threads,
}: CommentListProps): JSX.Element {
  if (threads.length === 0) {
    return (
      <p className="py-4 text-center font-mono text-[#878992] text-sm">
        Todavía no hay comentarios. ¡Sé el primero!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {threads.map((thread) => (
        <CommentItem comment={thread} idPost={idPost} key={thread.id} />
      ))}
    </ul>
  );
}
