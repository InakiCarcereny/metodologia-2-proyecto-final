'use client';

import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { useModalStore } from '@/store/modal-store';

export function EditProfileButton(): JSX.Element {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <Button
      className="w-32 font-light"
      onClick={() => openModal('edit-profile')}
      type="button"
      variant="tertiary"
    >
      Editar perfil
    </Button>
  );
}
