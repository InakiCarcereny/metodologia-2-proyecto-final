'use client';

import type { JSX } from 'react';
import { useTransition } from 'react';
import { removeFollower } from '@/actions/follow';

interface RemoveFollowerButtonProps {
  onRemoved: () => void;
  userId: string;
}

export function RemoveFollowerButton({
  onRemoved,
  userId,
}: RemoveFollowerButtonProps): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    startTransition(async () => {
      const result = await removeFollower(userId);
      if (!result.error) onRemoved();
    });
  };

  return (
    <button
      className="w-24 cursor-pointer rounded-lg border border-[#fdecea] bg-[#fdecea] py-2 font-bold text-[#c0392b] text-[13px] transition-colors hover:border-[#fbdcd8] hover:bg-[#fbdcd8] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isPending}
      onClick={handleClick}
      type="button"
    >
      Eliminar
    </button>
  );
}
