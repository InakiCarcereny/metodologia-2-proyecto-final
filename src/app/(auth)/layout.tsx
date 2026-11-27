import type { JSX } from 'react';

export default function AuthLayout({
  children,
}: LayoutProps<'/'>): JSX.Element {
  return <div className="flex min-h-screen w-full">{children}</div>;
}
