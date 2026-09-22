import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { LogoutButton } from '@/components/LogoutButton';
import { NavList } from '@/components/NavList';
import { Separator } from '@/components/Separator';
import { TagList } from '@/components/TagList';
import { UserCard } from '@/components/UserCard';

export function NavigationSideBar(): JSX.Element {
  return (
    <aside className="sticky top-0 flex flex-col justify-between gap-6 overflow-y-auto py-6">
      <div className="flex flex-col gap-4">
        <header>
          <Link className="flex items-center gap-2" href="/home">
            <GlobeIcon />

            <h1 className="font-bold text-lg">DevHub</h1>
          </Link>
        </header>

        <UserCard />

        <NavList />

        <TagList />
      </div>

      <div className="flex flex-col gap-2">
        <Separator />

        <LogoutButton />
      </div>
    </aside>
  );
}
