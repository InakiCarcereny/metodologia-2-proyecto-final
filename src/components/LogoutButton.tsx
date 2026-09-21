import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';

export function LogoutButton(): JSX.Element {
  return (
    <Button className="pl-2 text-start" type="button" variant="secondary">
      Cerrar sesión
    </Button>
  );
}
