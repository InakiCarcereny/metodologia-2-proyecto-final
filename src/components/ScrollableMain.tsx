'use client';

import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';
import { useGlobalScrollRedirect } from '@/hooks/useGlobalScrollRedirect';

interface ScrollableMainProps {
  children: ReactNode;
}

export function ScrollableMain({ children }: ScrollableMainProps): JSX.Element {
  const mainRef = useRef<HTMLElement>(null);

  useGlobalScrollRedirect(mainRef);

  return (
    <main
      className="scrollbar-none overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden"
      ref={mainRef}
    >
      {children}
    </main>
  );
}
