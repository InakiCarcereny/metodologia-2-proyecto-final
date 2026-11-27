'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createPost } from '@/actions/posts';
import { AttachmentButton } from '@/components/AttachmentButton';
import { ComposerCodeFields } from '@/components/ComposerCodeFields';
import { ComposerImagePreview } from '@/components/ComposerImagePreview';
import { ComposerTypeSelector } from '@/components/ComposerTypeSelector';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/ui/Button';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { Textarea } from '@/components/ui/Textarea';
import { useImageUpload } from '@/hooks/useImageUpload';
import { type CreatePostInput, createPostSchema } from '@/schemas/post';
import { useUserStore } from '@/store/user-store';

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
    control,
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

  const resetComposer = (): void => {
    reset({
      content: '',
      tags: [],
      title: '',
    });

    imageUpload.setUrl(null);
    setServerError(undefined);
  };

  const handleRemoveImage = (): void => {
    imageUpload.setUrl(null);
    setValue('imageUrl', undefined);
  };

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

        <ComposerTypeSelector
          error={errors.type?.message}
          onChange={(postType) =>
            setValue('type', postType, { shouldValidate: true })
          }
          value={type}
        />

        {type && (
          <>
            <Textarea
              className="min-h-24 w-full resize-y text-[#494d56] text-sm"
              control={control}
              error={errors.content}
              name="content"
              placeholder={
                type === 'snippet'
                  ? 'Contexto: qué intentaste, qué medía, qué querés que revisen. Markdown permitido.'
                  : type === 'question'
                    ? 'Tu pregunta: qué intentaste, qué esperabas, qué pasó. Markdown permitido.'
                    : 'Escribe tu artículo. Markdown permitido.'
              }
            />

            {type === 'snippet' && (
              <ComposerCodeFields
                codeSnippetError={errors.codeSnippet}
                register={register}
              />
            )}

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[#7e8288] text-xs">tags:</span>

              <TagInput
                onChange={(tags) => setValue('tags', tags)}
                values={selectedTags}
              />
            </div>

            {imageUpload.url && (
              <ComposerImagePreview
                onRemove={handleRemoveImage}
                url={imageUpload.url}
              />
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
