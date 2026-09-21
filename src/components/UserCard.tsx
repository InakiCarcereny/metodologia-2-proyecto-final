import Image from 'next/image';
import type { JSX } from 'react';
import { Separator } from '@/components/Separator';
import { Button } from '@/components/ui/Button';

export function UserCard(): JSX.Element {
  return (
    <article className="flex h-60 w-56 flex-col justify-between rounded-xl border border-[#dfe1e5] bg-[#ffffff] p-4">
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
          <span className="font-bold text-[14px]">Lucia Ferrer</span>

          <small className="text-[#7e8288] text-[12px]">@lucia.dev</small>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <small className="text-[#7e8288] text-[12px]">
          <span className="font-bold text-black">341</span> posts
        </small>

        <small className="text-[#7e8288] text-[12px]">
          <span className="font-bold text-black">2.1k</span> data
        </small>
      </div>

      <Button type="button" variant="primary">
        Publicar
      </Button>
    </article>
  );
}
