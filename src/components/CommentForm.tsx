'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createComment } from '@/actions/comments';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  type CreateCommentInput,
  createCommentSchema,
} from '@/schemas/comment';
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
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();

  const user = useUserStore((state) => state.user);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateCommentInput>({
    defaultValues: {
      content: '',
      idParent,
      idPost,
    },
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
    setServerError(undefined);

    startTransition(async () => {
      const result = await createComment(data);

      if ('error' in result) {
        if (typeof result.error === 'string') {
          setServerError(result.error);
          return;
        }

        const fieldErrors = (result.error ?? {}) as Record<
          string,
          string[] | undefined
        >;

        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages && messages.length > 0) {
            setError(field as keyof CreateCommentInput, {
              message: messages[0],
            });
          }
        }

        return;
      }

      reset({ content: '', idParent, idPost });
      onDone?.();
    });
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3">
        <PostCardAvatar
          avatarUrl={user?.avatarUrl ?? null}
          username={user?.username ?? 'user'}
        />

        <Textarea
          className="min-h-10 flex-1 text-[#494d56] text-sm"
          control={control}
          error={errors.content}
          name="content"
          placeholder={
            idParent ? 'Escribí una respuesta...' : 'Escribí un comentario'
          }
          rows={1}
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

      {serverError && (
        <span className="pl-11 font-medium text-red-400 text-sm">
          {serverError}
        </span>
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
