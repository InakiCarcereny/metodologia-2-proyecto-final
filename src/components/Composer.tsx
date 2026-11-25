'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createPost } from '@/actions/posts';
import { AttachmentButton } from '@/components/AttachmentButton';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { TagInput } from '@/components/TagInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { type CreatePostInput, createPostSchema } from '@/schemas/post';
import { useUserStore } from '@/store/user-store';
import { POST_TYPE_LABELS, type PostType } from './TypePill';
import { Button } from './ui/Button';
import { CardWrapper } from './ui/CardWrapper';

interface ComposerProps {
  onPublished?: () => void;
  showCancel?: boolean;
}

export function Composer({
  onPublished,
  showCancel = true,
}: ComposerProps): JSX.Element {
  const user = useUserStore((state) => state.user);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<CreatePostInput>({
    defaultValues: {
      content: '',
      tags: [],
      title: '',
    },
    resolver: zodResolver(createPostSchema),
  });

  const imageUpload = useImageUpload({
    errorMessage: 'No se pudo subir la imagen',
    onPersist: async (url) => {
      setValue('imageUrl', url);
      return {};
    },
  });

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();

  const type = watch('type');
  const selectedTags = watch('tags') ?? [];

  function resetComposer(): void {
    reset({
      content: '',
      tags: [],
      title: '',
    });

    imageUpload.setUrl(null);
    setServerError(undefined);
  }

  function handleRemoveImage(): void {
    imageUpload.setUrl(null);
    setValue('imageUrl', undefined);
  }

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    setServerError(undefined);

    startTransition(async () => {
      const result = await createPost(data);

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
            setError(field as keyof CreatePostInput, {
              message: messages[0],
            });
          }
        }

        return;
      }

      resetComposer();
      onPublished?.();
    });
  };

  return (
    <CardWrapper>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-3">
          <PostCardAvatar
            avatarUrl={user?.avatarUrl ?? null}
            username={user?.username ?? 'user'}
          />

          <input
            {...register('title')}
            className="min-w-0 flex-1 bg-transparent text-[#494d56] text-sm placeholder:text-[#878992] focus:outline-none"
            placeholder="¿Qué quieres compartir con el equipo?"
          />
        </div>

        {errors.title && (
          <span className="font-medium text-red-400 text-sm">
            {errors.title.message}
          </span>
        )}

        <div className="flex flex-wrap gap-2">
          {(Object.keys(POST_TYPE_LABELS) as PostType[]).map((postType) => (
            <Button
              className="px-3"
              key={postType}
              onClick={() =>
                setValue('type', postType, { shouldValidate: true })
              }
              type="button"
              variant={type === postType ? 'primary' : 'tertiary'}
            >
              {POST_TYPE_LABELS[postType]}
            </Button>
          ))}
        </div>

        {errors.type && (
          <span className="font-medium text-red-400 text-sm">
            {errors.type.message}
          </span>
        )}

        {type && (
          <>
            <textarea
              {...register('content')}
              className="min-h-24 w-full resize-y rounded-lg border border-[#d6d7db] bg-white p-3 text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
              placeholder={
                type === 'snippet'
                  ? 'Contexto: qué intentaste, qué medía, qué querés que revisen. Markdown permitido.'
                  : type === 'question'
                    ? 'Tu pregunta: qué intentaste, qué esperabas, qué pasó. Markdown permitido.'
                    : 'Escribe tu artículo. Markdown permitido.'
              }
            />

            {errors.content && (
              <span className="font-medium text-red-400 text-sm">
                {errors.content.message}
              </span>
            )}

            {type === 'snippet' && (
              <div className="overflow-hidden rounded-lg bg-[#1b1e26]">
                <div className="grid grid-cols-2 gap-3 border-white/10 border-b p-3">
                  <input
                    {...register('codeFilename')}
                    className="min-w-0 bg-transparent font-mono text-[#c3c9d4] text-xs placeholder:text-[#878992] focus:outline-none"
                    placeholder="ruta/archivo.ts"
                  />

                  <input
                    {...register('codeLanguage')}
                    className="min-w-0 bg-transparent text-right font-mono text-[#c3c9d4] text-xs placeholder:text-[#878992] focus:outline-none"
                    placeholder="lenguaje: rust"
                  />
                </div>

                <textarea
                  {...register('codeSnippet')}
                  className="min-h-48 w-full resize-y bg-transparent p-4 font-mono text-[#e4e6eb] text-xs placeholder:text-[#878992] focus:outline-none"
                  placeholder="// pega tu código acá"
                />

                {errors.codeSnippet && (
                  <span className="block px-4 pb-3 font-medium text-red-400 text-sm">
                    {errors.codeSnippet.message}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[#7e8288] text-xs">tags:</span>

              <TagInput
                onChange={(tags) => setValue('tags', tags)}
                values={selectedTags}
              />
            </div>

            {imageUpload.url && (
              <div className="relative overflow-hidden rounded-lg border border-[#dfe1e5]">
                <Image
                  alt="captura adjunta"
                  className="h-auto max-h-64 w-full object-contain"
                  height={338}
                  src={imageUpload.url}
                  width={600}
                />

                <Button
                  className="absolute top-2 right-2 px-2"
                  onClick={handleRemoveImage}
                  type="button"
                  variant="secondary"
                >
                  Quitar
                </Button>
              </div>
            )}

            {imageUpload.error && (
              <span className="font-medium text-red-400 text-sm">
                {imageUpload.error}
              </span>
            )}

            {serverError && (
              <span className="font-medium text-red-400 text-sm">
                {serverError}
              </span>
            )}

            <div className="flex items-center justify-between border-[#dfe1e5] border-t pt-3">
              <AttachmentButton
                onChange={imageUpload.handleChange}
                uploading={imageUpload.uploading}
              />

              <div className="flex items-center gap-3">
                {showCancel && (
                  <Button
                    onClick={resetComposer}
                    type="button"
                    variant="secondary"
                  >
                    Cancelar
                  </Button>
                )}

                <Button
                  className="px-5"
                  disabled={isPending}
                  type="submit"
                  variant="primary"
                >
                  {isPending ? 'Publicando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </CardWrapper>
  );
}
