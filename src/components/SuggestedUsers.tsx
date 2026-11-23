import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { SuggestedUserItem } from '@/components/SuggestedUserItem';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getSuggestedUserCards } from '@/data/profile';

export async function SuggestedUsers(): Promise<JSX.Element | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const users = await getSuggestedUserCards(session.user.id);
  if (users.length === 0) return null;

  return (
    <CardWrapper as="section" className="flex flex-col gap-2">
      <h2 className="font-medium text-[#878992] text-[12px]">
        USUARIOS SUGERIDOS
      </h2>

      <ul>
        {users.map((user) => (
          <SuggestedUserItem
            avatarUrl={user.avatarUrl}
            id={user.id}
            key={user.id}
            username={user.username}
          />
        ))}
      </ul>

      <Link
        className="mt-2 flex items-center gap-2 font-light text-[#4265b3] text-xs"
        href="/explore"
      >
        ver más <ArrowRight color="#4265b3" size={12} />
      </Link>
    </CardWrapper>
  );
}
