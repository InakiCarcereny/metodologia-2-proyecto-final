import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { useModalStore } from '@/store/modal-store';

export function PublishButton(): JSX.Element {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <Button
      onClick={() => openModal('create-post')}
      type="button"
      variant="primary"
    >
      Publicar
    </Button>
  );
}
