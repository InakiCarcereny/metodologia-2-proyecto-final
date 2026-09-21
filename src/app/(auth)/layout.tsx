import type { JSX } from 'react';

export default function AuthLayout({
  children,
}: LayoutProps<'/'>): JSX.Element {
  return (
    <div>
      layout
      {children}
    </div>
  );
}
