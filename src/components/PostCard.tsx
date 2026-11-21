import Image from 'next/image';
import { PostActions } from './PostActions';
import { TypePill } from './TypePill';
import { CardWrapper } from './ui/CardWrapper';
export function PostCard() {
  return (
    <CardWrapper as="article" className="flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image
            alt="image"
            className="rounded-[10px]"
            height={36}
            loading="eager"
            src="/tired-totoro.jpg"
            width={42}
          />

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[14px]">{'Lucía Ferrer'}</span>
              <span className="text-[#676b72] text-[12px]">@{'lucia.dev'}</span>
            </div>

            <small className="text-[#676b72] text-[12px]">
              {'hace 12 minutos'}
            </small>
          </div>
        </div>
        <TypePill type={'article'} />
      </header>

      <h2 className="font-bold text-[15px]">Titulo</h2>

      <p className="text-[#494d56] text-sm leading-relaxed">contenido</p>

      <footer className="border-[#dfe1e5] border-t pt-3">
        <PostActions comments={12} likes={450} shares={11} />
      </footer>
    </CardWrapper>
  );
}
