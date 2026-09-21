import Image from 'next/image';
import type { JSX } from 'react';

interface PillItem {
  label: string;
}

type PillList = PillItem[];

const PILLS: PillList = [
  {
    label: 'rust',
  },
  {
    label: 'typescript',
  },
] as const satisfies PillList;

export function UserPreview(): JSX.Element {
  return (
    <article className="flex h-38 max-w-113.75 flex-col justify-between rounded-lg border border-[#2e333d] bg-[#0c0f17] p-4">
      <span className="font-medium text-[#888c94] text-[12px]">
        ASÍ SE VERÁ TU PERFIL
      </span>

      <div className="flex gap-2">
        <Image
          alt="image"
          className="rounded-[10px]"
          height={36}
          loading="eager"
          src="/tired-totoro.jpg"
          width={42}
        />

        <div className="flex flex-col">
          <span className="font-bold text-[14px] text-white">@tu.handle</span>

          <small className="text-[#7e8288] text-[12px]">
            se unio hoy - 0 posts
          </small>
        </div>
      </div>

      <ul className="flex items-center gap-2">
        {PILLS.map((pill) => (
          <li
            className="rounded-md border border-[#2e333d] px-2 py-1 text-[#7e8288] text-xs"
            key={pill.label}
          >
            {pill.label}
          </li>
        ))}
      </ul>
    </article>
  );
}
