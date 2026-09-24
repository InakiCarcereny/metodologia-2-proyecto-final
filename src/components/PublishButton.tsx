import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';

export function PublishButton(): JSX.Element {
  return (
    <Button type="button" variant="primary">
      Publicar
    </Button>
  );
}
