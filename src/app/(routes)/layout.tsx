import type { JSX } from 'react';
import { ActivitySideBar } from '@/components/ActivitySideBar';
import { NavigationSideBar } from '@/components/NavigationSideBar';

export default function RoutesLayout({
  children,
}: LayoutProps<'/'>): JSX.Element {
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="grid w-full max-w-310 grid-cols-[14rem_1fr_14rem] gap-8">
        <NavigationSideBar />

        <main className="overflow-y-auto pt-6">{children}</main>

        <ActivitySideBar />
      </div>
    </div>
  );
}
