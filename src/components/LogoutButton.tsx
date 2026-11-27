'use client';

import { type JSX, useTransition } from 'react';
import { logoutAction } from '@/actions/logout';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/user-store';

export function LogoutButton(): JSX.Element {
  const clearUser = useUserStore((s) => s.clearUser);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      clearUser();
      await logoutAction();
    });
  }

  return (
    <Button
      className="pl-2 text-start"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
      variant="secondary"
    >
      {isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </Button>
  );
}
