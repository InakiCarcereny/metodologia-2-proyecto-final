import type { JSX } from 'react';
import { NavItem } from '@/components/NavItem';

interface INavItem {
  label: string;
  path: string;
}

type NavList = INavItem[];

const NAV_ITEMS: NavList = [
  {
    label: 'Inicio',
    path: '/home',
  },
  {
    label: 'Explorar',
    path: '/explore',
  },
  {
    label: 'Guardados',
    path: '/bookmarks',
  },
  {
    label: 'Mi perfil',
    path: '/profile',
  },
] as const satisfies NavList;

export function NavList(): JSX.Element {
  return (
    <ul className="flex w-full flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.path} label={item.label} path={item.path} />
      ))}
    </ul>
  );
}
