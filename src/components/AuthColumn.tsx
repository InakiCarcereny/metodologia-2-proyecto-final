import type { JSX, ReactNode } from 'react';

interface AuthColumnProps {
  children: ReactNode;
}

export function AuthLeftColumn({ children }: AuthColumnProps): JSX.Element {
  return (
    <section className="flex w-1/2 flex-col justify-between bg-[#141821] p-12">
      {children}
    </section>
  );
}

export function AuthRightColumn({ children }: AuthColumnProps): JSX.Element {
  return (
    <section className="flex w-1/2 items-center justify-center bg-[#f6f7f9]">
      <main className="flex w-full items-center justify-center">
        {children}
      </main>
    </section>
  );
}
