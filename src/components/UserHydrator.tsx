'use client';

import { type JSX, useEffect } from 'react';
import { useUserStore } from '@/store/user-store';
import type { UserCardData } from '@/types/user';

export function UserHydrator({
  user,
}: {
  user: UserCardData;
}): JSX.Element | null {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
