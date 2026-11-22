'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  getMyProfile,
  updateAvatar,
  updateCover,
  updateProfile,
} from '@/actions/profile';
import { FormError } from '@/components/FormError';
import { ImageUploadField } from '@/components/ImageUploadField';
import { Separator } from '@/components/Separator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  type EditProfileFormValues,
  editProfileSchema,
} from '@/schemas/profile';
import { useModalStore } from '@/store/modal-store';
import { useUserStore } from '@/store/user-store';
import type { UserProfile } from '@/types/user';

export function EditProfileModal(): JSX.Element {
  const router = useRouter();
  const closeModal = useModalStore((s) => s.closeModal);
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const avatar = useImageUpload({
    errorMessage: 'No se pudo subir el avatar',
    onPersist: updateAvatar,
    onUploaded: (url) => {
      if (user) setUser({ ...user, avatarUrl: url });
    },
  });

  const cover = useImageUpload({
    errorMessage: 'No se pudo subir la portada',
    onPersist: updateCover,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    getMyProfile().then((data) => {
      if (!data) return;

      setProfile(data);
      avatar.setUrl(data.avatarUrl);
      cover.setUrl(data.coverUrl);
      reset({
        bio: data.bio ?? '',
        location: data.location ?? '',
        website: data.website ?? '',
      });
    });
  }, [reset, avatar.setUrl, cover.setUrl]);

  const onSubmit: SubmitHandler<EditProfileFormValues> = async (data) => {
    setSubmitError(undefined);

    const result = await updateProfile(data);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    router.refresh();
    closeModal();
  };

  if (!profile) {
    return (
      <Modal title="editar perfil">
        <p className="font-light text-[#7e8288] text-sm">Cargando...</p>
      </Modal>
    );
  }

  return (
    <Modal title="Editar Perfil">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center gap-4">
          <ImageUploadField
            alt="avatar"
            fallback={
              <span className="flex h-16 w-16 items-center justify-center">
                <User color="white" size={36} />
              </span>
            }
            height={64}
            label="Cambiar avatar"
            onChange={avatar.handleChange}
            previewClassName="h-16 w-16 overflow-hidden rounded-xl bg-zinc-200"
            uploading={avatar.uploading}
            url={avatar.url}
            width={64}
          />

          <ImageUploadField
            alt="portada"
            height={64}
            label="Cambiar portada"
            onChange={cover.handleChange}
            previewClassName="h-16 w-24 overflow-hidden rounded-lg bg-zinc-200"
            uploading={cover.uploading}
            url={cover.url}
            width={96}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label
              className="font-semibold text-[#494d56] text-sm"
              htmlFor="bio"
            >
              Bio
            </label>

            <span className="text-[#95989f] text-xs">
              {(watch('bio') ?? '').length}/160
            </span>
          </div>

          <Textarea
            control={control}
            error={errors.bio}
            name="bio"
            placeholder="Contanos sobre vos"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label
              className="font-semibold text-[#494d56] text-sm"
              htmlFor="location"
            >
              Ubicación
            </label>

            <Input
              control={control}
              error={errors.location}
              name="location"
              placeholder="Ciudad, País"
              type="text"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label
              className="font-semibold text-[#494d56] text-sm"
              htmlFor="website"
            >
              Sitio
            </label>

            <Input
              control={control}
              error={errors.website}
              name="website"
              placeholder="https://"
              type="text"
            />
          </div>
        </div>

        <FormError message={avatar.error ?? cover.error ?? submitError} />

        <Separator />

        <div className="flex justify-end gap-2">
          <Button
            className="p-3"
            onClick={closeModal}
            type="button"
            variant="tertiary"
          >
            Cancelar
          </Button>

          <Button
            className="p-3"
            disabled={isSubmitting}
            type="submit"
            variant="primary"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
