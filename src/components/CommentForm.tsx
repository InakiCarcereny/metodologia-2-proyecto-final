'use client';

import type { FormEvent, JSX } from 'react';
import { useState, useTransition } from 'react';
import { createComment } from '@/actions/comments';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/user-store';

interface CommentFormProps {
  idParent?: string;
  idPost: string;
  onDone?: () => void;
}

export function CommentForm({
  idParent,
  idPost,
  onDone,
}: CommentFormProps): JSX.Element {
  const user = useUserStore((state) => state.user);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(undefined);

    if (content.trim().length === 0) {
      setError('El comentario no puede estar vacío');
      return;
    }

    startTransition(async () => {
      const result = await createComment({
        content,
        idParent,
        idPost,
      });

      if ('error' in result) {
        setError(
          typeof result.error === 'string'
            ? result.error
            : 'Revisá los campos del comentario',
        );
        return;
      }

      setContent('');
      onDone?.();
    });
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3">
        <PostCardAvatar
          avatarUrl={user?.avatarUrl ?? null}
          username={user?.username ?? 'user'}
        />

        <textarea
          className="min-h-10 flex-1 resize-none rounded-lg border border-[#d6d7db] bg-white p-3 text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            idParent ? 'Escribí una respuesta...' : 'Escribí un comentario'
          }
          rows={1}
          value={content}
        />

        <Button
          className="px-4"
          disabled={isPending}
          type="submit"
          variant="primary"
        >
          {isPending ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>

      {error && (
        <span className="pl-11 font-medium text-red-400 text-sm">{error}</span>
      )}

      {idParent && onDone && (
        <div className="pl-11">
          <Button onClick={onDone} type="button" variant="secondary">
            Cancelar respuesta
          </Button>
        </div>
      )}
    </form>
  );
}
