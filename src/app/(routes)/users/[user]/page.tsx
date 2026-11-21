import { notFound, redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ProfileHeader } from '@/components/ProfileHeader';
import { getUserProfileByUsername } from '@/data/profile';

export default async function User({
  params,
}: PageProps<'/users/[user]'>): Promise<JSX.Element> {
  const { user } = await params;

  const profile = await getUserProfileByUsername(user);
  if (!profile) notFound();

  const session = await auth();
  if (session?.user?.id === profile.id) redirect('/profile');

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader isOwnProfile={false} profile={profile} />

      <p className="text-center font-light text-[#7e8288] text-sm">
        Todavía no hay posts para mostrar.
      </p>
    </div>
  );
}
