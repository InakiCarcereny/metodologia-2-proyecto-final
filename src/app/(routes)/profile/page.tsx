import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ProfileHeader } from '@/components/ProfileHeader';
import { getUserProfileById } from '@/data/profile';

export default async function Profile(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const profile = await getUserProfileById(session.user.id);
  if (!profile) redirect('/login');

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader isOwnProfile profile={profile} />

      <p className="text-center font-light text-[#7e8288] text-sm">
        Todavía no hay posts para mostrar.
      </p>
    </div>
  );
}
