'use client';

import type { JSX } from 'react';
import { Composer } from '@/components/Composer';
import { Modal } from '@/components/ui/Modal';
import { useModalStore } from '@/store/modal-store';

export function PublishModal(): JSX.Element {
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <Modal title="Publicar">
      <Composer onPublished={closeModal} />
    </Modal>
  );
}
