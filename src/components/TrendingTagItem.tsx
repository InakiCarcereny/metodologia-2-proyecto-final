import Link from 'next/link';
import type { JSX } from 'react';

interface TrendingTagItemProps {
  label: string;
}

export function TrendingTagItem({ label }: TrendingTagItemProps): JSX.Element {
  return (
    <li>
      <Link
        className="block rounded-lg border border-[#dfe1e5] bg-none p-2 text-center font-light text-[#676b72] text-[13px] hover:border-[#9b9ea5]"
        href={`/tags/${label}`}
      >
        #{label}
      </Link>
    </li>
  );
}
