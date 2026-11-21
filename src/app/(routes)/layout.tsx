import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ActivitySideBar } from '@/components/ActivitySideBar';
import { NavigationSideBar } from '@/components/NavigationSideBar';
import { UserHydrator } from '@/components/UserHydrator';
import { getUserCardDataById } from '@/data/profile';

export default async function RoutesLayout({
  children,
}: LayoutProps<'/'>): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const cardData = await getUserCardDataById(session.user.id);
  if (!cardData) redirect('/login');

  return (
    <>
      <UserHydrator user={cardData} />

      <div className="flex h-screen w-full justify-center">
        <div className="grid w-full max-w-310 grid-cols-[14rem_1fr_18rem] gap-8">
          <NavigationSideBar />

          <main className="overflow-y-auto pt-6">{children}</main>

          <ActivitySideBar />
        </div>
      </div>
    </>
  );
}
