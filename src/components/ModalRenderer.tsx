'use client';

import type { JSX } from 'react';
import { EditProfileModal } from '@/components/EditProfileModal';
import { PublishModal } from '@/components/PublishModal';
import { useModalStore } from '@/store/modal-store';

export function ModalRenderer(): JSX.Element | null {
  const isOpen = useModalStore((s) => s.isOpen);
  const type = useModalStore((s) => s.type);

  if (!isOpen) return null;

  switch (type) {
    case 'create-post':
      return <PublishModal />;
    case 'edit-profile':
      return <EditProfileModal />;
    default:
      return null;
  }
}
