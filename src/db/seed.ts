import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { db } from './index';
import * as schema from './schema';

const {
  users,
  profiles,
  tags,
  posts,
  postTags,
  comments,
  followers,
  postLikes,
  postShares,
  bookmarks,
  commentLikes,
  userTagFollows,
} = schema;

const USERS_COUNT = 40;
const POSTS_COUNT = 150;
const MAX_TAGS_PER_POST = 3;
const FOLLOWERS_COUNT = 250;
const POST_LIKES_COUNT = 600;
const POST_SHARES_COUNT = 150;
const BOOKMARKS_COUNT = 200;
const COMMENT_LIKES_COUNT = 300;
const USER_TAG_FOLLOWS_COUNT = 200;
const SEED_PASSWORD = 'Password123!';
const CHUNK_SIZE = 200;

function pick<T>(arr: T[]): T {
  return faker.helpers.arrayElement(arr);
}

function dicebearUrl(
  style: 'avataaars' | 'shapes',
  seed: string,
  size: number,
): string {
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=${size}`;
}

function randomComment(): string {
  const base = pick(COMMENT_TEMPLATES);
  const extra = faker.helpers.maybe(() => pick(COMMENT_TEMPLATES), {
    probability: 0.25,
  });
  return extra && extra !== base ? `${base} ${extra}` : base;
}

function pickSome<T>(arr: T[], min: number, max: number): T[] {
  const n = faker.number.int({ max: Math.min(max, arr.length), min });
  return faker.helpers.arrayElements(arr, n);
}

async function insertInChunks<T extends Record<string, unknown>>(
  table: Parameters<typeof db.insert>[0],
  rows: T[],
) {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    if (chunk.length > 0) {
      await db.insert(table).values(chunk);
    }
  }
}

function uniquePairs<A, B>(
  count: number,
  pickA: () => A,
  pickB: () => B,
  options: { sameSet?: boolean } = {},
): [A, B][] {
  const seen = new Set<string>();
  const result: [A, B][] = [];
  let attempts = 0;
  const maxAttempts = count * 20;

  while (result.length < count && attempts < maxAttempts) {
    attempts += 1;
    const a = pickA();
    const b = pickB();
    if (options.sameSet && String(a) === String(b)) continue;
    const key = `${a}:${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push([a, b]);
  }

  return result;
}

const TAGS = [
  {
    description: 'El lenguaje que corre el mundo (para bien o para mal).',
    label: 'javascript',
  },
  {
    description: 'JavaScript con tipos, para dormir mas tranquilo.',
    label: 'typescript',
  },
  {
    description: 'Componentes, hooks y algun que otro re-render de mas.',
    label: 'react',
  },
  {
    description: 'El framework de React que hace casi todo por vos.',
    label: 'nextjs',
  },
  { description: 'JavaScript del lado del servidor.', label: 'nodejs' },
  {
    description: 'El borrow checker es tu amigo, aunque no lo sientas asi.',
    label: 'rust',
  },
  { description: 'Para scripts, data e IA, todo en uno.', label: 'python' },
  { description: 'Concurrencia simple y binarios chiquitos.', label: 'go' },
  {
    description: 'Funciona en mi maquina... y ahora en todas.',
    label: 'docker',
  },
  { description: 'Orquestando contenedores desde 2015.', label: 'kubernetes' },
  { description: 'Consultas, joins y algun que otro N+1.', label: 'sql' },
  {
    description: 'La base de datos relacional favorita de muchos.',
    label: 'postgresql',
  },
  {
    description: 'Rebase, merge, y el eterno conflicto de conflictos.',
    label: 'git',
  },
  { description: 'Terminal, dotfiles y mucha configuracion.', label: 'linux' },
  {
    description: 'Modelos, prompts y la promesa de automatizar todo.',
    label: 'ia',
  },
  {
    description: 'Entrenar modelos y esperar que generalicen bien.',
    label: 'machine-learning',
  },
  { description: 'Flexbox, grid, y centrar un div.', label: 'css' },
  { description: 'Tests unitarios, de integracion y e2e.', label: 'testing' },
];

type PostTemplate = {
  title: string;
  content: string;
  type: 'snippet' | 'article' | 'question';
  codeFilename?: string;
  codeLanguage?: string;
  codeSnippet?: string;
  tagLabels: string[];
};

const POST_TEMPLATES: PostTemplate[] = [
  {
    content:
      'Probe el borrow checker en un proyecto grande por primera vez y la verdad que al principio duele, pero despues te salva de mil bugs de concurrencia.',
    tagLabels: ['rust'],
    title: 'Un mes con Rust en produccion',
    type: 'article',
  },
  {
    codeFilename: 'main.rs',
    codeLanguage: 'rust',
    codeSnippet:
      'fn main() {\n    let nums = vec![1, 2, 3];\n    let sum: i32 = nums.iter().sum();\n    println!("{sum}");\n}',
    content: 'Snippet rapidito para sumar un vector sin loop manual.',
    tagLabels: ['rust'],
    title: 'Sumar con iteradores',
    type: 'snippet',
  },
  {
    content:
      '¿Cuando conviene usar server actions y cuando directamente armar una API route? Estoy migrando un proyecto viejo y no tengo del todo claro el criterio.',
    tagLabels: ['nextjs', 'react'],
    title: 'Server actions vs API routes en Next.js',
    type: 'question',
  },
  {
    codeFilename: 'debounce.ts',
    codeLanguage: 'typescript',
    codeSnippet:
      'function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {\n  let timeout: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn(...args), ms);\n  };\n}',
    content: 'No siempre hace falta una libreria para esto.',
    tagLabels: ['typescript', 'javascript'],
    title: 'Debounce casero en 10 lineas',
    type: 'snippet',
  },
  {
    content:
      'Les comparto el compose que uso para levantar la app y la base en un solo comando. Nada del otro mundo pero ahorra bastante tiempo al equipo.',
    tagLabels: ['docker', 'postgresql'],
    title: 'Docker compose para un stack Next + Postgres',
    type: 'article',
  },
  {
    content:
      'Veniamos con npm de toda la vida, el equipo esta evaluando pnpm por el tema de espacio en disco y velocidad de instalacion. ¿Experiencias?',
    tagLabels: ['nodejs'],
    title: '¿Vale la pena migrar a pnpm?',
    type: 'question',
  },
  {
    content:
      'Agregamos un indice compuesto en una tabla de 5 millones de filas y la query paso de 4 segundos a 40ms. A veces la solucion es asi de simple.',
    tagLabels: ['postgresql', 'sql'],
    title: 'Indices en Postgres: antes y despues',
    type: 'article',
  },
  {
    codeFilename: 'query.sql',
    codeLanguage: 'sql',
    codeSnippet:
      'SELECT u.username, COUNT(p.id) AS total_posts\nFROM users u\nLEFT JOIN posts p ON p.id_user = u.id\nGROUP BY u.username\nORDER BY total_posts DESC;',
    content: 'Para traer el conteo de posts por usuario en una sola consulta.',
    tagLabels: ['sql', 'postgresql'],
    title: 'Query con JOIN y agregacion',
    type: 'snippet',
  },
  {
    content:
      'Despues de años de probar distintas configuraciones termine en algo bastante minimalista con LazyVim como base. Dejo el repo por si les sirve.',
    tagLabels: ['linux', 'git'],
    title: 'Mi configuracion de Neovim para 2026',
    type: 'article',
  },
  {
    codeFilename: 'context.py',
    codeLanguage: 'python',
    codeSnippet:
      'from contextlib import contextmanager\n\n@contextmanager\ndef timer():\n    import time\n    start = time.time()\n    yield\n    print(f"Elapsed: {time.time() - start:.3f}s")',
    content: 'Un ejemplo simple para manejar recursos sin repetir try/finally.',
    tagLabels: ['python'],
    title: 'Context managers en Python',
    type: 'snippet',
  },
  {
    content:
      'Tenemos varios paquetes compartidos y cada vez cuesta mas decidir que tests corren en cada CI. ¿Alguna estrategia que les haya funcionado bien?',
    tagLabels: ['testing'],
    title: '¿Como organizan el testing en monorepos?',
    type: 'question',
  },
  {
    codeFilename: 'worker.go',
    codeLanguage: 'go',
    codeSnippet:
      'sem := make(chan struct{}, 5)\nfor _, job := range jobs {\n    sem <- struct{}{}\n    go func(j Job) {\n        defer func() { <-sem }()\n        process(j)\n    }(job)\n}',
    content: 'Un patron simple con channels para limitar concurrencia.',
    tagLabels: ['go'],
    title: 'Goroutines sin dolores de cabeza',
    type: 'snippet',
  },
  {
    content:
      'Resumen de como empaquetamos un modelo entrenado en Python y lo expusimos como un servicio HTTP liviano, con cache de resultados incluido.',
    tagLabels: ['ia', 'machine-learning', 'python'],
    title: 'Deployar un modelo de IA como API',
    type: 'article',
  },
  {
    content:
      'Despues de tanto tiempo usando ambos, mi regla mental: flexbox para una dimension, grid cuando necesito filas y columnas a la vez.',
    tagLabels: ['css'],
    title: 'Grid vs Flexbox, ¿cuando usar cada uno?',
    type: 'article',
  },
  {
    codeFilename: 'useClickOutside.ts',
    codeLanguage: 'typescript',
    codeSnippet:
      'function useClickOutside(ref: React.RefObject<HTMLElement>, onOutside: () => void) {\n  useEffect(() => {\n    function handler(e: MouseEvent) {\n      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();\n    }\n    document.addEventListener("mousedown", handler);\n    return () => document.removeEventListener("mousedown", handler);\n  }, [ref, onOutside]);\n}',
    content: 'Lo uso en casi todos los proyectos con React.',
    tagLabels: ['react', 'typescript'],
    title: 'Hook para detectar click afuera de un modal',
    type: 'snippet',
  },
  {
    content:
      'Tenemos 3 servicios y poco trafico. Nos tienta por aprender pero no se si es matar una mosca a cañonazos.',
    tagLabels: ['kubernetes', 'docker'],
    title: '¿Kubernetes para un proyecto chico vale la pena?',
    type: 'question',
  },
  {
    content:
      'Antes de abrir el PR, me gusta aplastar los commits de "fix typo" en uno solo. Les dejo el flujo que uso.',
    tagLabels: ['git'],
    title: 'Rebase interactivo para limpiar el historial',
    type: 'article',
  },
  {
    content: 'Este es mio, por eso no deberia tener el boton de guardar.',
    tagLabels: ['javascript'],
    title: 'Post propio de prueba',
    type: 'question',
  },
  {
    content:
      'Desde que los adopte reduje un monton de ifs defensivos. Les dejo un par de casos donde mas los uso.',
    tagLabels: ['javascript', 'typescript'],
    title: 'Optional chaining y nullish coalescing, combo ganador',
    type: 'article',
  },
  {
    content:
      'Estamos pasando de variables sueltas en el pipeline a un vault. ¿Que usan ustedes para esto en proyectos chicos?',
    tagLabels: ['docker', 'linux'],
    title: '¿Como manejan los secrets en CI/CD?',
    type: 'question',
  },
  {
    codeFilename: 'transfer.ts',
    codeLanguage: 'typescript',
    codeSnippet:
      'await db.transaction(async (tx) => {\n  await tx.update(accounts).set({ balance: sql`balance` }).where(eq(accounts.id, from));\n  await tx.update(accounts).set({ balance: sql`balance` }).where(eq(accounts.id, to));\n});',
    content: 'Para que varias escrituras se apliquen todas o ninguna.',
    tagLabels: ['typescript', 'postgresql'],
    title: 'Transacciones en Postgres con Drizzle',
    type: 'snippet',
  },
  {
    content:
      'Nada muy sofisticado, un clasificador simple, pero fue la primera vez que entendi de verdad el flujo de train/test split.',
    tagLabels: ['python', 'machine-learning'],
    title: 'Mi primer modelo entrenado con scikit-learn',
    type: 'article',
  },
  {
    content:
      'La imagen final me queda en casi 1.5GB para una API chica. Seguro me estoy olvidando de algo en el Dockerfile.',
    tagLabels: ['docker'],
    title: '¿Por que mi build de Docker pesa tanto?',
    type: 'question',
  },
  {
    codeFilename: 'usePagination.ts',
    codeLanguage: 'typescript',
    codeSnippet:
      'function usePagination(total: number, pageSize = 10) {\n  const [page, setPage] = useState(1);\n  const totalPages = Math.ceil(total / pageSize);\n  return { page, totalPages, next: () => setPage((p) => Math.min(p + 1, totalPages)), prev: () => setPage((p) => Math.max(p - 1, 1)) };\n}',
    content: 'Lo armamos para no repetir la misma logica en cada listado.',
    tagLabels: ['react', 'typescript'],
    title: 'Custom hook para paginacion',
    type: 'snippet',
  },
  {
    content:
      'Hace un año que migre a Linux como entorno principal de desarrollo. Resumo los errores tipicos que cometi al arrancar.',
    tagLabels: ['linux'],
    title: 'Linux desde cero: lo que me hubiese gustado saber',
    type: 'article',
  },
  {
    content:
      'En el equipo estamos en desacuerdo con la prioridad. Unos quieren cobertura rapida con unitarios, otros prefieren ir directo a integracion.',
    tagLabels: ['testing'],
    title: '¿Testing unitario o de integracion primero?',
    type: 'question',
  },
  {
    codeFilename: 'commands.rs',
    codeLanguage: 'rust',
    codeSnippet:
      'match command.as_str() {\n    "start" => start(),\n    "stop" => stop(),\n    other => println!("Comando desconocido: {other}"),\n}',
    content:
      'El match de Rust hace que este tipo de cosas sea bastante legible.',
    tagLabels: ['rust'],
    title: 'Pattern matching en Rust para parsear comandos',
    type: 'snippet',
  },
  {
    content:
      'Despues de meses laburando con modelos de lenguaje, el consejo que mas repito es: dale ejemplos concretos, no solo instrucciones.',
    tagLabels: ['ia'],
    title: 'Prompt engineering: lo que aprendi iterando',
    type: 'article',
  },
  {
    content:
      'Arrancamos un proyecto nuevo y la duda es si conviene prender `strict: true` desde el inicio o ir de a poco.',
    tagLabels: ['typescript'],
    title: '¿Vale la pena TypeScript estricto desde el dia uno?',
    type: 'question',
  },
  {
    codeFilename: 'middleware.ts',
    codeLanguage: 'typescript',
    codeSnippet:
      'export function middleware(req: NextRequest) {\n  const session = req.cookies.get("session");\n  if (!session) return NextResponse.redirect(new URL("/login", req.url));\n  return NextResponse.next();\n}',
    content: 'Para redirigir si no hay sesion antes de que cargue la pagina.',
    tagLabels: ['nextjs'],
    title: 'Middleware de autenticacion en Next.js',
    type: 'snippet',
  },
  {
    codeFilename: '.gitconfig',
    codeLanguage: 'bash',
    codeSnippet:
      '[alias]\n  st = status -sb\n  co = checkout\n  cm = commit -m\n  lg = log --oneline --graph --all',
    content: 'Nada revolucionario pero me ahorran bastante tipeo.',
    tagLabels: ['git'],
    title: 'Alias de git que uso todos los dias',
    type: 'snippet',
  },
];

const CONTENT_EXTRAS = [
  '¿A alguien mas le paso algo parecido?',
  'Cualquier sugerencia para mejorarlo es bienvenida.',
  'Despues cuento como sigue si hay novedades.',
  'Lo deje simplificado para que se entienda la idea general.',
  'Capaz hay una forma mas prolija de hacerlo, si conocen una se las agradezco.',
  'De paso, gracias a los que me ayudaron en el grupo a resolverlo.',
  'Lo probe en dev, todavia no lo lleve a produccion.',
  'Lo dejo documentado aca para no olvidarme la proxima.',
  'Si les interesa el detalle completo lo puedo ampliar en otro post.',
  'Nada del otro mundo, pero me parecio compartirlo igual.',
];

const COMMENT_TEMPLATES = [
  'Buenisimo esto, gracias por compartir!',
  '¿Probaste con otra libreria para este caso?',
  'Yo tuve el mismo problema la semana pasada, me re sirve esto.',
  'No estoy del todo de acuerdo, en mi experiencia funciono distinto.',
  'Che, esto me salvo la tarde. Gracias!',
  '¿Tenes el repo completo en algun lado?',
  'Excelente explicacion, mucho mas clara que la documentacion oficial.',
  '¿Cuanto tiempo te llevo armar esto?',
  'Totalmente de acuerdo, nosotros migramos hace poco y fue la mejor decision.',
  '¿Funciona igual en la ultima version?',
  'Guardado para cuando tenga que hacer algo parecido.',
  'Un detalle: te conviene manejar el caso de error ahi tambien.',
  'Justo lo que necesitaba, mil gracias.',
  '¿Y el rendimiento como lo mediste?',
  'Interesante enfoque, no lo habia pensado asi.',
  'Yo lo resolvi distinto, pero me gusta mas tu version.',
  '¿Esto lo usan en produccion o todavia lo estan probando?',
  'Yo iria por otro approach, pero entiendo por que lo hiciste asi.',
  'Che, hace rato buscaba algo asi, gracias totales.',
  '¿Hay benchmark de esto contra la alternativa mas comun?',
  'Me paso de usar esto y despues arrepentirme, ojo con los edge cases.',
  '100% esto. Lo vengo diciendo hace rato.',
  '¿Donde lo leiste? ¿Tenes la fuente original?',
  'Buen punto, no lo habia considerado desde ese angulo.',
  'A mi se me rompio justo por eso que decis, buenisimo el aviso.',
  'Lo voy a probar este finde en un proyecto personal.',
  '¿Y si en vez de eso usas una queue? Capaz te simplifica bastante.',
  'Gran resumen, lo voy a compartir con el equipo.',
];

const REPLY_TEMPLATES = [
  'Si, a mi tambien me funciono haciendolo asi.',
  'No, probe eso y no cambio mucho la verdad.',
  'Exacto, es lo mismo que termine haciendo yo.',
  'Dale, probalo y despues contame como te fue.',
  '+1, me paso lo mismo en un proyecto parecido.',
  'Mira, a mi me tiro un error distinto cuando lo intente.',
  'Coincido totalmente con tu punto.',
  'Gracias por la aclaracion, ahora tiene mas sentido.',
  'Puede ser, aunque yo lo probaria antes en un entorno de test.',
  '¿Te sigue pasando despues de hacer eso?',
  'Tal cual, esa fue la solucion que mas me convencio tambien.',
  'Buena pregunta, no se si tiene una respuesta unica.',
  'Depende del caso, pero en general estoy de acuerdo.',
  'Ahi esta el tema, por eso al final opte por otra cosa.',
  'Si, el repo lo tengo privado por ahora pero puedo compartir el fragmento.',
];

async function clearDatabase() {
  // console.log('🧹 Borrando datos existentes...');
  await db.delete(commentLikes);
  await db.delete(postLikes);
  await db.delete(postShares);
  await db.delete(bookmarks);
  await db.delete(userTagFollows);
  await db.delete(postTags);
  await db.delete(comments);
  await db.delete(followers);
  await db.delete(posts);
  await db.delete(profiles);
  await db.delete(tags);
  await db.delete(users);
}

async function seedUsersAndProfiles() {
  // console.log(`👤 Creando ${USERS_COUNT} usuarios...`);
  const passwordHash = bcrypt.hashSync(SEED_PASSWORD, 10);

  const usernames = new Set<string>();
  while (usernames.size < USERS_COUNT) {
    usernames.add(
      faker.internet
        .username()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, ''),
    );
  }

  const userRows = Array.from(usernames).map((username) => ({
    createdAt: faker.date.past({ years: 1 }),
    email: faker.internet.email({ firstName: username }).toLowerCase(),
    emailVerified: faker.date.past({ years: 1 }),
    id: randomUUID(),
    passwordHash,
    username,
  }));

  await insertInChunks(users, userRows);

  const profileRows = userRows.map((user) => ({
    avatarUrl: dicebearUrl('avataaars', user.username, 200),
    bio:
      faker.helpers.maybe(() => faker.person.bio(), { probability: 0.8 }) ??
      null,
    coverUrl:
      faker.helpers.maybe(
        () => dicebearUrl('shapes', `${user.username}-cover`, 800),
        {
          probability: 0.5,
        },
      ) ?? null,
    id: user.id,
    location:
      faker.helpers.maybe(() => `${faker.location.city()}, Argentina`, {
        probability: 0.6,
      }) ?? null,
    website:
      faker.helpers.maybe(() => faker.internet.url(), { probability: 0.4 }) ??
      null,
  }));

  await insertInChunks(profiles, profileRows);

  return userRows;
}

async function seedTags() {
  // console.log(`🏷️  Creando ${TAGS.length} tags...`);
  const tagRows = TAGS.map((t) => ({
    createdAt: faker.date.past({ years: 1 }),
    description: t.description,
    id: randomUUID(),
    label: t.label,
  }));
  await insertInChunks(tags, tagRows);
  return tagRows;
}

type PostRow = {
  id: string;
  title: string;
  content: string;
  type: 'snippet' | 'article' | 'question';
  codeFilename: string | null;
  codeLanguage: string | null;
  codeSnippet: string | null;
  imageUrl: string | null;
  idUser: string;
  createdAt: Date;
};

const ACTIVE_USERS_COUNT = 10;
const LANGUAGES_PER_ACTIVE_USER = { max: 5, min: 3 };

async function seedPosts(
  userRows: Array<{ id: string }>,
  tagRows: Array<{ id: string; label: string }>,
) {
  // console.log(`📝 Creando ${POSTS_COUNT} posts...`);
  const tagByLabel = new Map(tagRows.map((t) => [t.label, t]));

  const postRows: PostRow[] = [];
  const postTagRows: Array<{ idPost: string; idTag: string; createdAt: Date }> =
    [];

  function addPost(template: PostTemplate, idUser: string) {
    const id = randomUUID();
    const createdAt = faker.date.recent({ days: 120 });
    const hasImage =
      template.type === 'article' &&
      faker.datatype.boolean({ probability: 0.4 });

    const templateTags = template.tagLabels
      .map((label) => tagByLabel.get(label))
      .filter((t): t is { id: string; label: string } => Boolean(t));
    const extraTags = pickSome(
      tagRows,
      0,
      MAX_TAGS_PER_POST - templateTags.length,
    );

    const mainTagLabel = template.tagLabels[0] ?? pick(tagRows).label;

    const content =
      faker.helpers.maybe(() => `${template.content} ${pick(CONTENT_EXTRAS)}`, {
        probability: 0.65,
      }) ?? template.content;

    postRows.push({
      codeFilename: template.codeFilename ?? null,
      codeLanguage: template.codeLanguage ?? null,
      codeSnippet: template.codeSnippet ?? null,
      content,
      createdAt,
      id,
      idUser,
      imageUrl: hasImage ? dicebearUrl('shapes', mainTagLabel, 400) : null,
      title: template.title,
      type: template.type,
    });

    const chosenTags = new Map<string, { id: string }>();
    for (const t of [...templateTags, ...extraTags]) {
      chosenTags.set(t.id, t);
    }
    for (const tag of chosenTags.values()) {
      postTagRows.push({ createdAt, idPost: id, idTag: tag.id });
    }
  }

  const templatesByLanguage = new Map<string, PostTemplate[]>();
  for (const template of POST_TEMPLATES) {
    if (!template.codeLanguage) continue;
    const list = templatesByLanguage.get(template.codeLanguage) ?? [];
    list.push(template);
    templatesByLanguage.set(template.codeLanguage, list);
  }
  const availableLanguages = [...templatesByLanguage.keys()];

  const activeUsers = faker.helpers.arrayElements(
    userRows,
    Math.min(ACTIVE_USERS_COUNT, userRows.length),
  );

  for (const user of activeUsers) {
    const languageCount = faker.number.int(LANGUAGES_PER_ACTIVE_USER);
    const languages = faker.helpers.arrayElements(
      availableLanguages,
      Math.min(languageCount, availableLanguages.length),
    );
    for (const language of languages) {
      const template = pick(templatesByLanguage.get(language) ?? []);
      if (template) addPost(template, user.id);
    }
  }

  const remaining = Math.max(0, POSTS_COUNT - postRows.length);
  for (let i = 0; i < remaining; i += 1) {
    addPost(pick(POST_TEMPLATES), pick(userRows).id);
  }

  await insertInChunks(posts, postRows);
  await insertInChunks(postTags, postTagRows);

  return postRows;
}

async function seedComments(
  postRows: Array<{ id: string; createdAt: Date }>,
  userRows: Array<{ id: string }>,
) {
  // console.log('💬 Creando comentarios...');
  const commentRows: Array<{
    id: string;
    content: string;
    idPost: string;
    idUser: string | null;
    idParent: string | null;
    createdAt: Date;
  }> = [];

  for (const post of postRows) {
    const topLevelCount = faker.number.int({ max: 6, min: 0 });
    const createdIds: string[] = [];

    for (let i = 0; i < topLevelCount; i += 1) {
      const id = randomUUID();
      createdIds.push(id);
      commentRows.push({
        content: randomComment(),
        createdAt: faker.date.soon({ days: 10, refDate: post.createdAt }),
        id,
        idParent: null,
        idPost: post.id,
        idUser: pick(userRows).id,
      });
    }

    const replyCount = faker.number.int({
      max: Math.min(3, createdIds.length * 2),
      min: 0,
    });
    for (let i = 0; i < replyCount && createdIds.length > 0; i += 1) {
      commentRows.push({
        content: pick(REPLY_TEMPLATES),
        createdAt: faker.date.soon({ days: 10, refDate: post.createdAt }),
        id: randomUUID(),
        idParent: pick(createdIds),
        idPost: post.id,
        idUser: pick(userRows).id,
      });
    }
  }

  await insertInChunks(comments, commentRows);
  return commentRows;
}

async function seedInteractions(
  userRows: Array<{ id: string }>,
  postRows: Array<{ id: string }>,
  commentRows: Array<{ id: string }>,
  tagRows: Array<{ id: string }>,
) {
  // console.log('❤️  Creando likes, shares, bookmarks y follows...');

  const userIds = userRows.map((u) => u.id);
  const postIds = postRows.map((p) => p.id);
  const commentIds = commentRows.map((c) => c.id);
  const tagIds = tagRows.map((t) => t.id);

  const followerPairs = uniquePairs(
    FOLLOWERS_COUNT,
    () => pick(userIds),
    () => pick(userIds),
    { sameSet: true },
  );
  await insertInChunks(
    followers,
    followerPairs.map(([idFollower, idUser]) => ({
      createdAt: faker.date.past({ years: 1 }),
      idFollower,
      idUser,
    })),
  );

  const postLikePairs = uniquePairs(
    POST_LIKES_COUNT,
    () => pick(postIds),
    () => pick(userIds),
  );
  await insertInChunks(
    postLikes,
    postLikePairs.map(([idPost, idUser]) => ({
      createdAt: faker.date.past({ years: 1 }),
      idPost,
      idUser,
    })),
  );

  const postSharePairs = uniquePairs(
    POST_SHARES_COUNT,
    () => pick(postIds),
    () => pick(userIds),
  );
  await insertInChunks(
    postShares,
    postSharePairs.map(([idPost, idUser]) => ({
      createdAt: faker.date.past({ years: 1 }),
      idPost,
      idUser,
    })),
  );

  const bookmarkPairs = uniquePairs(
    BOOKMARKS_COUNT,
    () => pick(userIds),
    () => pick(postIds),
  );
  await insertInChunks(
    bookmarks,
    bookmarkPairs.map(([idUser, idPost]) => ({
      createdAt: faker.date.past({ years: 1 }),
      idPost,
      idUser,
    })),
  );

  if (commentIds.length > 0) {
    const commentLikePairs = uniquePairs(
      COMMENT_LIKES_COUNT,
      () => pick(commentIds),
      () => pick(userIds),
    );
    await insertInChunks(
      commentLikes,
      commentLikePairs.map(([idComment, idUser]) => ({
        createdAt: faker.date.past({ years: 1 }),
        idComment,
        idUser,
      })),
    );
  }

  const userTagFollowPairs = uniquePairs(
    USER_TAG_FOLLOWS_COUNT,
    () => pick(userIds),
    () => pick(tagIds),
  );
  await insertInChunks(
    userTagFollows,
    userTagFollowPairs.map(([idUser, idTag]) => ({
      followedAt: faker.date.past({ years: 1 }),
      idTag,
      idUser,
    })),
  );
}

async function main() {
  // console.log('🌱 Iniciando seed de la base de datos...\n');

  await clearDatabase();
  const userRows = await seedUsersAndProfiles();
  const tagRows = await seedTags();
  const postRows = await seedPosts(userRows, tagRows);
  const commentRows = await seedComments(postRows, userRows);
  await seedInteractions(userRows, postRows, commentRows, tagRows);

  //   console.log('\n✅ Seed completado:');
  //   console.log(
  //     `   - ${userRows.length} usuarios (password para todos: "${SEED_PASSWORD}")`,
  //   );
  //   console.log(`   - ${tagRows.length} tags`);
  //   console.log(`   - ${postRows.length} posts`);
  //   console.log(`   - ${commentRows.length} comentarios`);
}

main()
  .then(() => process.exit(0))
  .catch((_) => {
    // console.error('❌ Error al correr el seed:', err);
    process.exit(1);
  });
