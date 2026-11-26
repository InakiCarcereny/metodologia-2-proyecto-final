import {
  Bookmark,
  GitBranch,
  GlobeIcon,
  Heart,
  MessageCircle,
  Repeat2,
} from 'lucide-react';
import Link from 'next/link';
import type { ElementType, JSX, ReactNode } from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { cn } from '@/lib/utils';
import type { PostType } from '@/types/post';
import { POST_TYPE_LABELS, POST_TYPE_STYLES } from '@/utils/post-type';

const FEATURES = [
  {
    description:
      'Ruta del archivo y lenguaje. Los comentarios se pueden anclar en una línea puntual del código.',
    title: 'Código con revisión',
    type: 'snippet',
  },
  {
    description:
      'La comunidad responde en los comentarios del post. Todo el intercambio queda ordenado ahí mismo, en el mismo hilo.',
    title: 'Preguntas con contexto',
    type: 'question',
  },
  {
    description:
      'Hasta 5000 caracteres. Con más lugar que un snippet o una pregunta.',
    title: 'Textos largos',
    type: 'article',
  },
] as const;

const TRENDING_TAGS = ['rust', 'postgres', 'typescript', 'wasm'] as const;

const FEATURED_USERS = [
  {
    description: 'Runtimes async y observabilidad.',
    followers: '4,8k',
    name: 'Nadia Kern',
    username: 'nadia.kern',
  },
  {
    description: 'Tipos que describen el dominio.',
    followers: '7,9k',
    name: 'Ana Kuriakos',
    username: 'anak',
  },
  {
    description: 'Tamaño de bundle y glue a mano.',
    followers: '2,4k',
    name: 'Ivo Menéndez',
    username: 'ivo.wasm',
  },
] as const;

const STEPS = [
  { label: 'Elegí tu handle y tu correo', n: 1 },
  { label: 'Entrás directo a "para ti", con posts de toda la red', n: 2 },
  { label: 'Publicas snippet, pregunta o artículo', n: 3 },
] as const;

const LEGAL_LINKS = [
  { href: '#', label: 'Normas' },
  { href: '#', label: 'Privacidad' },
  { href: '#', label: 'Estado del servicio' },
] as const;

interface SectionProps {
  as?: ElementType;
  bg: string;
  children: ReactNode;
  className?: string;
}

function Section({
  as: Tag = 'section',
  bg,
  children,
  className,
}: SectionProps): JSX.Element {
  return (
    <Tag className={cn('w-full', bg)}>
      <div className={cn('mx-auto max-w-300 px-6', className)}>{children}</div>
    </Tag>
  );
}

interface FeedPreviewCardProps {
  avatarUsername: string;
  children: ReactNode;
  comments: number;
  handle: string;
  likes: number;
  name: string;
  reposts: number;
  time: string;
  type: PostType;
}

function FeedPreviewCard({
  avatarUsername,
  children,
  comments,
  handle,
  likes,
  name,
  reposts,
  time,
  type,
}: FeedPreviewCardProps): JSX.Element {
  return (
    <CardWrapper as="article" className="flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserAvatar
            avatarUrl={null}
            className="h-9 w-9"
            iconSize={20}
            imageSize={36}
            username={avatarUsername}
          />

          <div>
            <p className="flex items-center gap-1">
              <span className="font-bold text-[14px]">{name}</span>
              <span className="font-light text-[#7e8288] text-[13px]">
                @{handle}
              </span>
            </p>
            <small className="text-[#7e8288] text-[12px]">{time}</small>
          </div>
        </div>

        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-medium text-[11px]',
            POST_TYPE_STYLES[type],
          )}
        >
          {POST_TYPE_LABELS[type]}
        </span>
      </header>

      {children}

      <div className="border-[#dfe1e5] border-b" />

      <footer className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-[#9b9ea5]">
          <span className="flex items-center gap-1">
            <MessageCircle size={14} /> {comments}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 size={14} /> {reposts}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={14} /> {likes}
          </span>
        </div>
        <Bookmark className="text-[#9b9ea5]" size={14} />
      </footer>
    </CardWrapper>
  );
}

export default function Home(): JSX.Element {
  return (
    <>
      <Section
        as="header"
        bg="border-[#dfe1e5] border-b bg-white"
        className="flex flex-wrap items-center justify-between gap-4 py-5"
      >
        <Link className="flex items-center gap-2" href="/">
          <GlobeIcon color="black" />
          <span className="font-bold text-lg">DevHub</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            className="text-[#494d56] text-sm hover:text-black"
            href="/login"
          >
            Entrar
          </Link>

          <Link
            className="rounded-lg bg-[#171b22] px-5 py-2 font-semibold text-[13px] text-white hover:bg-[#303540]"
            href="/register"
          >
            Crear cuenta
          </Link>
        </nav>
      </Section>

      <Section
        bg="bg-white"
        className="flex flex-wrap items-center gap-14 py-10 pb-18"
      >
        <div className="min-w-0 flex-1 basis-110">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf1fd] px-3 py-1 font-medium text-[#3b6fd4] text-xs">
            <GitBranch size={13} />
            conecta tu cuenta de GitHub
          </span>

          <h1 className="mt-4 mb-4 font-extrabold text-[#171b22] text-[46px] leading-[1.1] tracking-tight">
            Publica código,
            <br />
            no capturas.
          </h1>

          <p className="mb-7 max-w-[46ch] text-[#494d56] text-base leading-relaxed">
            Red social para desarrolladores. Snippets con revisión de pares,
            preguntas que se resuelven en los comentarios y artículos largos.
            Feed cronológico, sin algoritmo: todo el mundo o solo a quien
            seguís.
          </p>

          <dl className="mt-2 flex gap-10 border-[#dfe1e5] border-t pt-5">
            <div>
              <dt className="font-extrabold text-2xl">1000+</dt>
              <dd className="text-[#8c9097] text-[13px]">publicaciones</dd>
            </div>

            <div>
              <dt className="font-extrabold text-2xl">40</dt>
              <dd className="text-[#8c9097] text-[13px]">
                tags con actividad diaria
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex min-w-0 flex-1 basis-105 flex-col gap-4">
          <FeedPreviewCard
            avatarUsername="lucia.dev"
            comments={34}
            handle="lucia.dev"
            likes={218}
            name="Lucía Ferrer"
            reposts={12}
            time="hace 12 min"
            type="snippet"
          >
            <p className="whitespace-pre-wrap font-sans text-[#494d56] text-[13px] leading-[1.6]">
              Reescribí el parser con un iterador perezoso para el parser: 3,1×
              y cero allocations. Busco ojos sobre el manejo del lifetime.
            </p>

            <div className="overflow-hidden rounded-lg border border-[#dfe1e5]">
              <div className="flex items-center justify-between bg-[#f6f7f9] px-3 py-1.5 font-mono text-[#7e8288] text-[12px]">
                <span>src/parser.rs</span>
                <span>rust</span>
              </div>

              <pre className="overflow-x-auto bg-[#0c0f17] p-3 font-mono text-[#e4e6eb] text-[12px] leading-relaxed">
                <code>
                  <span className="text-[#c586c0]">pub fn</span>{' '}
                  tokens&lt;&apos;a&gt;(src: &amp; &apos;a{' '}
                  <span className="text-[#4ec9b0]">str</span>) -&gt;{' '}
                  <span className="text-[#4ec9b0]">impl</span> Iterator&lt;Item
                  = Token&lt; &apos;a&gt;&gt; {'{'}
                  {'\n'}
                  {'    '}src.split_inclusive(|c: char| c.is_whitespace())
                  {'\n'}
                  {'        '}.filter(|s| !s.is_empty())
                  {'\n'}
                  {'        '}.map(Token::new)
                  {'\n'}
                  {'}'}
                </code>
              </pre>
            </div>
          </FeedPreviewCard>

          <FeedPreviewCard
            avatarUsername="dsalas"
            comments={9}
            handle="dsalas"
            likes={46}
            name="Diego Salas"
            reposts={2}
            time="hace 48 min"
            type="question"
          >
            <p className="whitespace-pre-wrap font-sans text-[#494d56] text-[13px] leading-[1.6]">
              El planner ignora mi índice compuesto tras el VACUUM FULL. Mismo
              plan en staging y producción hasta ayer, las estadísticas se ven
              idénticas en los dos entornos.
            </p>
          </FeedPreviewCard>
        </div>
      </Section>

      <Section bg="bg-[#f6f7f9]" className="py-12">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-extrabold text-[26px]">
            Tres formas de publicar
          </h2>
          <span className="font-mono text-[#8c9097] text-[13px]">
            sin anuncios · sin métricas de vanidad
          </span>
        </div>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {FEATURES.map((feature) => (
            <CardWrapper
              as="li"
              className="flex flex-col gap-2.5"
              key={feature.type}
            >
              <span
                className={cn(
                  'self-start rounded-full px-2.5 py-1 font-medium font-mono text-[11px]',
                  POST_TYPE_STYLES[feature.type],
                )}
              >
                {POST_TYPE_LABELS[feature.type]}
              </span>

              <h3 className="font-bold text-[17px]">{feature.title}</h3>

              <p className="text-[#494d56] text-sm leading-relaxed">
                {feature.description}
              </p>
            </CardWrapper>
          ))}
        </ul>
      </Section>

      <Section bg="bg-white" className="py-12">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-extrabold text-[26px]">
            Vos elegís qué ver, no un algoritmo
          </h2>
          <span className="font-mono text-[#8c9097] text-[13px]">
            cronológico · sin algoritmo
          </span>
        </div>

        <div className="mb-8 flex flex-wrap gap-10">
          <div className="flex-1 basis-70">
            <div className="mb-3 flex gap-6 border-[#dfe1e5] border-b">
              <span className="-mb-px border-[#171b22] border-b-2 pb-3 font-bold text-[14px]">
                para ti
              </span>
              <span className="pb-3 font-medium text-[#676b72] text-[14px]">
                de quien sigo
              </span>
            </div>
            <p className="text-[#494d56] text-sm leading-relaxed">
              En <strong>para ti</strong> ves todos los posts de la red, del más
              nuevo al más viejo. En <strong>de quien sigo</strong> solo lo que
              publica la gente que seguís. Nada de relevancia calculada ni posts
              reordenados.
            </p>
          </div>

          <div className="flex-1 basis-70">
            <h3 className="mb-2 font-bold text-[#8c9097] text-xs tracking-wide">
              TAGS PARA ENCONTRAR GENTE CON TU STACK
            </h3>
            <ul className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <li
                  className="rounded-lg border border-[#d6d7db] px-2.5 py-1 font-mono text-[#494d56] text-[12px]"
                  key={tag}
                >
                  #{tag}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#494d56] text-sm leading-relaxed">
              Los seguís para encontrar perfiles y repasar lo que se publicó con
              ese tag — no cambian el orden de tu feed.
            </p>
          </div>
        </div>

        <h3 className="mt-9 mb-4 font-bold text-[#8c9097] text-xs tracking-wide">
          GENTE QUE YA PUBLICA AQUÍ
        </h3>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {FEATURED_USERS.map((user) => (
            <CardWrapper
              as="li"
              className="flex flex-col gap-2.5"
              key={user.username}
            >
              <div className="flex items-center gap-2.5">
                <UserAvatar
                  avatarUrl={null}
                  className="h-9 w-9"
                  iconSize={20}
                  imageSize={36}
                  username={user.username}
                />

                <div>
                  <p className="font-bold text-[14px]">{user.name}</p>
                  <span className="text-[#7e8288] text-[13px]">
                    @{user.username}
                  </span>
                </div>
              </div>

              <p className="text-[#494d56] text-[13px] leading-relaxed">
                {user.description} {user.followers} seguidores.
              </p>
            </CardWrapper>
          ))}
        </ul>
      </Section>

      <Section
        bg="bg-[#f6f7f9]"
        className="flex flex-wrap items-center justify-between gap-12 py-14"
      >
        <div className="min-w-0 flex-1 basis-85">
          <h2 className="mb-2.5 font-extrabold text-[26px]">
            Tres pasos y estás publicando.
          </h2>

          <p className="mb-5 max-w-[48ch] text-[#494d56] text-[15px] leading-relaxed">
            Sin código de invitación y sin esperar aprobación. Elegís handle y
            correo, y entrás directo a un feed con posts de toda la red.
          </p>

          <Link
            className="inline-block rounded-lg bg-[#171b22] px-5 py-2.5 font-semibold text-[13px] text-white hover:bg-[#303540]"
            href="/register"
          >
            Crear cuenta
          </Link>
        </div>

        <ol className="flex min-w-75 flex-1 basis-85 flex-col gap-2.5">
          {STEPS.map((step) => (
            <li
              className={cn(
                'flex items-center gap-3 rounded-[10px] border px-4 py-3.5 text-sm',
                step.n === 3
                  ? 'border-[#171b22] bg-[#171b22] text-white'
                  : 'border-[#dfe1e5] bg-white text-[#171b22]',
              )}
              key={step.n}
            >
              <span
                className={step.n === 3 ? 'text-[#9aa0ab]' : 'text-[#8c9097]'}
              >
                {step.n}
              </span>
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        as="footer"
        bg="border-[#dfe1e5] border-t bg-white"
        className="flex flex-wrap items-center justify-between gap-4 py-6"
      >
        <span className="text-[#8c9097] text-[13px]">DevHub © 2026</span>

        <ul className="flex items-center gap-5">
          {LEGAL_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                className="text-[#8c9097] text-[13px] hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
