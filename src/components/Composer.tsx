'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createPost } from '@/actions/posts';
import { ImageUploadField } from '@/components/ImageUploadField';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { TagInput } from '@/components/TagInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { type CreatePostInput, createPostSchema } from '@/schemas/post';
import { useUserStore } from '@/store/user-store';
import { POST_TYPE_LABELS, type PostType } from './TypePill';
import { Button } from './ui/Button';
import { CardWrapper } from './ui/CardWrapper';
import { Input } from './ui/Input';

interface ComposerProps {
  onPublished?: () => void;
}

export function Composer({ onPublished }: ComposerProps): JSX.Element {
  const user = useUserStore((s) => s.user);
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
    defaultValues: { content: '', type: 'article' },
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
            setError(field as keyof CreatePostInput, { message: messages[0] });
          }
        }
        return;
      }

      reset();
      imageUpload.setUrl(null);
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

          <textarea
            {...register('content')}
            className="min-h-10 flex-1 resize-none bg-transparent pt-2 text-[#676b72] text-sm placeholder:text-[#676b72] focus:outline-none"
            placeholder="¿Qué quieres compartir con el equipo?"
          />
        </div>

        {errors.content && (
          <span className="font-medium text-red-400 text-sm">
            {errors.content.message}
          </span>
        )}

        <div className="flex flex-wrap gap-2">
          {(Object.keys(POST_TYPE_LABELS) as PostType[]).map((key) => (
            <Button
              className="w-24 font-light"
              key={key}
              onClick={() => setValue('type', key, { shouldValidate: true })}
              type="button"
              variant={type === key ? 'primary' : 'tertiary'}
            >
              {POST_TYPE_LABELS[key]}
            </Button>
          ))}
        </div>

        {type === 'snippet' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                control={control}
                error={errors.codeFilename}
                name="codeFilename"
                placeholder="archivo.ts"
                type="text"
              />
              <Input
                control={control}
                error={errors.codeLanguage}
                name="codeLanguage"
                placeholder="typescript"
                type="text"
              />
            </div>

            <textarea
              {...register('codeSnippet')}
              className="w-full resize-none rounded-lg border border-[#d6d7db] bg-white p-3 font-mono text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
              placeholder="// tu código acá"
              rows={6}
            />

            {errors.codeSnippet && (
              <span className="font-medium text-red-400 text-sm">
                {errors.codeSnippet.message}
              </span>
            )}
          </div>
        )}

        <TagInput
          onChange={(nextTags) => setValue('tags', nextTags)}
          values={watch('tags') ?? []}
        />

        <ImageUploadField
          alt="captura adjunta"
          fallback={
            <span className="font-mono text-[#878992] text-xs">
              Sin captura adjunta
            </span>
          }
          height={160}
          label="Agregar captura"
          onChange={imageUpload.handleChange}
          previewClassName="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-[#dfe1e5]"
          uploading={imageUpload.uploading}
          url={imageUpload.url}
          width={320}
        />

        {imageUpload.error && (
          <span className="font-medium text-red-400 text-sm">
            {imageUpload.error}
          </span>
        )}

        {imageUpload.url && (
          <div className="flex justify-center">
            <Button
              onClick={handleRemoveImage}
              type="button"
              variant="secondary"
            >
              Quitar captura
            </Button>
          </div>
        )}

        {serverError && (
          <span className="font-medium text-red-400 text-sm">
            {serverError}
          </span>
        )}

        <div className="flex justify-end">
          <Button disabled={isPending} type="submit" variant="primary">
            {isPending ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </form>
    </CardWrapper>
  );
}
