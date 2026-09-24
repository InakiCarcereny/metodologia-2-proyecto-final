import type { JSX } from 'react';
import { TagItem } from '@/components/TagItem';

interface Tag {
  label: string;
  path: string;
}

type TagList = Tag[];

// CADA UNA DE LAS TAGS VA A VENIR DE LAS QUE SIGA EL USUARIO
// CADA UNA DE ESTAS VA A SER UNA RUTA DINAMICA
const TAGS: TagList = [
  {
    label: 'rust',
    path: '/tags/rust',
  },
  {
    label: 'typescript',
    path: '/tags/typescript',
  },
  {
    label: 'postgres',
    path: '/tags/postgres',
  },
  {
    label: 'wasm',
    path: '/tags/wasm',
  },
] as const satisfies TagList;

export function TagList(): JSX.Element {
  return (
    <ul className="flex w-full flex-col gap-1">
      {TAGS.map((tag) => (
        <TagItem key={tag.label} label={tag.label} path={tag.path} />
      ))}
    </ul>
  );
}
