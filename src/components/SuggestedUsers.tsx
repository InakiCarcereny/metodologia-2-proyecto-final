import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { SuggestedUserItem } from '@/components/SuggestedUserItem';
import { CardWrapper } from '@/components/ui/CardWrapper';

interface User {
  name: string;
  username: string;
}

type Users = User[];

// CADA UNO DE LOS USUARIOS SUGERIDOS VIENE DE LA DB
// CADA UNO DE LOS USURIOS VA A SER UNA RUTA DINAMICA
const USERS: Users = [
  {
    name: 'Nadia Kern',
    username: 'nadia.kern',
  },
  {
    name: 'Tomar Iriarte',
    username: 'tomi.pg',
  },
  {
    name: 'Ivo Menendez',
    username: 'ivo.wasm',
  },
] as const satisfies Users;

export function SuggestedUsers(): JSX.Element {
  return (
    <CardWrapper as="section" className="flex flex-col gap-2">
      <h2 className="font-medium text-[#878992] text-[12px]">
        USUARIOS SUGERIDOS
      </h2>

      <ul>
        {USERS.map((user) => (
          <SuggestedUserItem
            key={user.username}
            name={user.name}
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
