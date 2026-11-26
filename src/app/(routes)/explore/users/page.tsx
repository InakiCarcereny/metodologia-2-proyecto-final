import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ExploreUserCard } from '@/components/ExploreUserCard';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { searchExploreUsers } from '@/data/profile';

interface ExploreUsersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ExploreUsers({
  searchParams,
}: ExploreUsersPageProps): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const users = await searchExploreUsers(query, session.user.id, 20);

  return (
    <div className="flex flex-col gap-5">
      <Link
        className="w-fit font-mono text-[#7e8288] text-sm hover:text-[#171b22]"
        href="/explore"
      >
        ← volver a explorar
      </Link>

      <h1 className="font-bold text-2xl text-[#171b22]">
        Resultados de búsqueda: {query}
      </h1>

      <CardWrapper className="p-0">
        {users.length === 0 ? (
          <p className="py-6 text-center font-mono text-[#878992] text-sm">
            No se encontraron usuarios.
          </p>
        ) : (
          <ul className="flex flex-col">
            {users.map((user, index) => (
              <ExploreUserCard
                avatarUrl={user.avatarUrl}
                bio={user.bio}
                followersCount={user.followersCount}
                id={user.id}
                isFollowing={user.isFollowing}
                isLastRow={index === users.length - 1}
                isRightColumn
                key={user.id}
                username={user.username}
              />
            ))}
          </ul>
        )}
      </CardWrapper>
    </div>
  );
}
