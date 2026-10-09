import Image from 'next/image';
import type { JSX } from 'react';
import { Button } from './ui/Button';
import { CardWrapper } from './ui/CardWrapper';

const POST_CATEGORIES = {
  article: 'artículo',
  question: 'pregunta',
  snippet: 'snippet',
} as const;

export function Composer(): JSX.Element {
  return (
    <CardWrapper className="">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
        <Image
          alt="image"
          className="rounded-[10px]"
          height={36}
          loading="eager"
          src="/tired-totoro.jpg"
          width={42}
        />
        <textarea
          className="min-h-10 flex-1 resize-none bg-transparent pt-2 text-[#676b72] text-sm placeholder:text-[#676b72] focus:outline-none"
          placeholder="¿Qué quieres compartir con el equipo?"
        />

        <div className="col-start-2 flex flex-wrap gap-2">
          {Object.entries(POST_CATEGORIES).map(([key, value]) => (
            <Button
              className="w-24 font-light"
              key={key}
              type="button"
              variant="tertiary"
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
