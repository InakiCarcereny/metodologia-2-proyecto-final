'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  path: string;
}

export function NavItem({ label, path }: NavItemProps): JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <li className="w-full">
      <Link
        className={cn(
          'block w-full rounded-lg p-2 text-[13px] hover:bg-white',
          isActive
            ? 'border border-[#dfe1e5] bg-white font-bold text-black'
            : 'font-medium text-[#676b72]',
        )}
        href={path}
      >
        {label}
      </Link>
    </li>
  );
}
