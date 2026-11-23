'use client';

import type { FormEvent, JSX } from 'react';
import { useState, useTransition } from 'react';
import { createComment } from '@/actions/comments';
import { Button } from '@/components/ui/Button';

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
      const result = await createComment({ content, idParent, idPost });

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
      <textarea
        className="w-full resize-none rounded-lg border border-[#d6d7db] bg-white p-3 text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Escribí tu comentario..."
        rows={idParent ? 2 : 3}
        value={content}
      />

      {error && (
        <span className="font-medium text-red-400 text-sm">{error}</span>
      )}

      <div className="flex justify-end gap-2">
        {idParent && onDone && (
          <Button onClick={onDone} type="button" variant="secondary">
            Cancelar
          </Button>
        )}

        <Button disabled={isPending} type="submit" variant="primary">
          {isPending ? 'Publicando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
}
