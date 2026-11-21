import type { JSX } from 'react';

interface ActivityItem {
  author: string;
  content: string;
  meta: string;
  type: 'snippet' | 'pregunta' | 'articulo';
}

type ActivityList = ActivityItem[];

const TYPE_STYLES: Record<ActivityItem['type'], string> = {
  articulo: 'bg-[#4a3a1a] text-[#e8b84b]',
  pregunta: 'bg-[#1a2e4a] text-[#5b9bd5]',
  snippet: 'bg-[#4a1a33] text-[#e85b9b]',
};

const ACTIVITY: ActivityList = [
  {
    author: 'lucia.dev',
    content: 'Pool de conexiones sin unwrap() en 12 líneas',
    meta: '#rust · 48 likes · 9 comentarios',
    type: 'snippet',
  },
  {
    author: 'marco_ts',
    content: '¿Zod o Valibot para validar en el edge?',
    meta: '#typescript · 14 respuestas',
    type: 'pregunta',
  },
  {
    author: 'ana.pg',
    content: 'Índices parciales: lo que nadie te cuenta',
    meta: '#postgres · 6 min de lectura',
    type: 'articulo',
  },
] as const satisfies ActivityList;

export function ActivityPreview(): JSX.Element {
  return (
    <article className="flex max-w-113.75 flex-col gap-4 rounded-lg border border-[#2e333d] bg-[#0c0f17] p-4">
      <span className="font-medium text-[#888c94] text-[12px]">
        MIENTRAS NO ESTABAS
      </span>

      <ul className="flex flex-col gap-4">
        {ACTIVITY.map((item) => (
          <li className="flex flex-col gap-1" key={item.author}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#888c94] text-[13px]">
                @{item.author}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 font-medium text-[11px] ${TYPE_STYLES[item.type]}`}
              >
                {item.type}
              </span>
            </div>

            <p className="font-light text-[14px] text-white">{item.content}</p>

            <span className="font-light text-[#7e8288] text-xs">
              {item.meta}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
