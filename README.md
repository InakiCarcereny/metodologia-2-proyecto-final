![Preview](/docs/assets/project-preview.png)

<div align="center">

# DevHub

### Red social exclusiva para desarrolladores

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-%23000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-%23000000.svg?style=for-the-badge&logo=drizzle&logoColor=C5F74F)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

[![CI](https://github.com/InakiCarcereny/metodologia-2-proyecto-final/actions/workflows/ci.yml/badge.svg)](https://github.com/InakiCarcereny/metodologia-2-proyecto-final/actions/workflows/ci.yml)

## Integrantes - Grupo N-9

Iñaki Carcereny · Valentín De Pascale

</div>

---

## Descripción

**DevHub** es una red social para desarrolladores. Cada usuario cuenta con un perfil integrado con la API de GitHub, donde se muestran sus repositorios y los lenguajes de programación que más utiliza. Además, permite crear publicaciones, incluyendo posts de código.

---

## Estructura del proyecto

```
metodologia-2-proyecto-final/
├── .github/
│   └── workflows/
│       └── ci.yml        # Pipeline de CI (lint, typecheck, test, build)
├── .husky/               # Git hooks (pre-commit, commit-msg, etc.)
├── .vscode/              # Configuración del editor para el equipo
├── docs/                 # Documentación técnica (ver docs/README.md para el índice)
│   ├── architecture.md   # Arquitectura, capas y diagramas de flujo
│   ├── api.md            # Contrato de cada Server Action y Route Handler
│   ├── testing/          # Casos de testing documentados: regla, casos, niveles, límites
│   ├── design-patterns/  # Patrones de diseño aplicados: problema, alternativas, decisión
│   ├── design-principles/# Aplicaciones puntuales de SOLID/Clean Code sobre código real
│   └── assets/           # Imágenes referenciadas desde los docs
├── drizzle/              # Migraciones SQL generadas por Drizzle Kit (no editar a mano)
├── public/               # Assets estáticos (imágenes, íconos, etc.)
├── src/
│   ├── actions/          # Server actions de Next.js
│   ├── adapters/         # Adapters de APIs externas (ej. GitHub)
│   ├── app/              # Rutas y páginas (App Router) + Route Handlers (app/api)
│   ├── components/       # Componentes de React reutilizables (UI)
│   ├── data/             # Capa de acceso a datos (queries de Drizzle por entidad)
│   ├── db/               # Esquema de Drizzle y conexión a Postgres
│   ├── hooks/            # Custom hooks de React
│   ├── lib/              # Utilidades y configuraciones
│   ├── mocks/            # Datos de prueba para desarrollo/UI
│   ├── schemas/          # Esquemas de validación (Zod)
│   ├── services/         # Lógica de integración con APIs externas
│   ├── store/            # Estado global (Zustand)
│   ├── tests/
│   │   ├── unit/         # Tests unitarios (schemas, utils) — sin DB
│   │   ├── integration/  # Tests de integración — acción + Drizzle + Postgres reales
│   │   └── e2e/          # Tests end-to-end con Playwright, contra la app corriendo
│   ├── types/            # Tipos y definiciones reutilizables de TypeScript
│   ├── utils/            # Funciones utilitarias generales
│   ├── auth.config.ts    # Configuración base de Auth.js
│   ├── auth.ts           # Instancia y handlers de Auth.js
│   ├── middleware.ts     # Middleware de Next.js (rutas protegidas)
│   └── routes.ts         # Definición de rutas públicas/privadas
├── .dockerignore
├── .editorconfig
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
├── biome.json            # Configuración de linting/formatting
├── commitlint.config.js  # Reglas para mensajes de commit
├── docker-compose.yml    # Orquestación de contenedores (app + DB)
├── Dockerfile
├── drizzle.config.ts     # Configuración de Drizzle ORM
├── next.config.ts
├── package.json
├── playwright.config.ts  # Configuración de Playwright (tests E2E)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── vitest.config.ts      # Configuración de Vitest
└── vitest.setup.ts
```

---

## Cómo levantar el proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) v22 o superior
- [pnpm](https://pnpm.io/) v11 o superior
- [Docker](https://www.docker.com/) y Docker Compose (opcional, para levantar Postgres localmente)

### 1. Clonar el repositorio

```bash
git clone https://github.com/InakiCarcereny/metodologia-2-proyecto-final
cd metodologia-2-proyecto-final
```

### 2. Instalar dependencias

```bash
pnpm install
```

Esto también configura automáticamente los git hooks de Husky (`prepare` script).

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Variables necesarias (ver también [`.env.example`](./.env.example)):

| Variable | Para qué sirve | Valor de ejemplo / cómo obtenerlo |
| --- | --- | --- |
| `DATABASE_URL` | Connection string de Postgres que usa Drizzle. | `postgres://postgres:postgres@localhost:5432/mi_app` (coincide con el usuario/clave/puerto de `docker-compose.yml`). |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta de Cloudinary donde se suben imágenes (avatar, portada, posts con imagen). | Panel de Cloudinary → Dashboard → "Cloud name". |
| `CLOUDINARY_API_KEY` | Credencial de API de Cloudinary. | Panel de Cloudinary → Dashboard → "API Key". |
| `CLOUDINARY_API_SECRET` | Secreto de API de Cloudinary. **No commitear nunca el valor real.** | Panel de Cloudinary → Dashboard → "API Secret". |
| `AUTH_SECRET` | Clave usada por Auth.js para firmar sesiones/tokens. | Cualquier string random y largo, ej. generado con `npx auth secret`. |
| `AUTH_GITHUB_ID` | Client ID de la OAuth App de GitHub (login y conexión de cuenta con GitHub). | GitHub → Settings → Developer settings → OAuth Apps. |
| `AUTH_GITHUB_SECRET` | Client Secret de esa misma OAuth App. **No commitear nunca el valor real.** | Misma pantalla que `AUTH_GITHUB_ID`. |

> Al crear la OAuth App en GitHub, la "Authorization callback URL" tiene que ser `http://localhost:3000/api/auth/callback/github` (login) — la conexión de cuenta ya logueada reutiliza la misma OAuth App vía `/api/github/connect/callback`. Ver [`docs/api.md`](./docs/api.md) para el detalle de ambos flujos.

### 4. Levantar la base de datos

**Opción A — con Docker (recomendado):**

```bash
docker compose up -d db
```

**Opción B — Postgres instalado localmente:**

Asegurate de tener una instancia de Postgres corriendo y que `DATABASE_URL` en tu `.env` apunte correctamente a ella.

### 5. Aplicar las migraciones de la base de datos

```bash
pnpm db:migrate
```

Si es la primera vez y no tenés migraciones generadas todavía:

```bash
pnpm db:generate
pnpm db:migrate
```

(Opcional) cargar datos de prueba:

```bash
pnpm db:seed
```

### 6. Levantar el proyecto en desarrollo

```bash
pnpm dev
```

La app va a estar disponible en [http://localhost:3000](http://localhost:3000).

### 7. Verificar que todo funciona

Antes de ponerte a cambiar código, corré la misma validación que corre en CI:

```bash
pnpm ci
```

Esto corre lint, typecheck y los tests con cobertura (ver [tabla de scripts](#scripts-disponibles)). Si falla acá, es un problema de entorno (versión de Node, dependencias, `.env`).

### 8. (Opcional) Levantar todo con Docker

Si preferís correr la app completa (frontend + DB) en contenedores:

```bash
docker compose up --build
```

---

## Scripts disponibles

Todas las tareas repetitivas están encapsuladas como scripts de `pnpm`.

### Desarrollo

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Levanta la app en modo desarrollo en `http://localhost:3000`. |
| `pnpm build` | Genera el build de producción. |
| `pnpm start` | Sirve el build de producción ya generado (correr `build` antes). |

### Calidad de código

| Script | Qué hace |
| --- | --- |
| `pnpm lint` | Corre Biome en modo chequeo (lint + formato), sin modificar archivos. |
| `pnpm lint:fix` | Igual que `lint`, pero corrigiendo automáticamente lo que se pueda. |
| `pnpm format` | Formatea el código con Biome. |
| `pnpm format:check` | Verifica el formato sin escribir cambios. |
| `pnpm typecheck` | Corre el compilador de TypeScript sin emitir archivos (`tsc --noEmit`). |

### Testing

| Script | Qué hace |
| --- | --- |
| `pnpm test` | Corre los tests una vez (`vitest run`). |
| `pnpm test:watch` | Corre los tests en modo watch. |
| `pnpm test:coverage` | Corre los tests con reporte de cobertura. |
| `pnpm test:unit` | Corre solo los tests unitarios (`src/tests/unit`). |
| `pnpm test:integration` | Corre solo los tests de integración (`src/tests/integration`); requiere Postgres activo y migraciones aplicadas. |
| `pnpm test:e2e` | Corre los tests end-to-end con Playwright (`src/tests/e2e`). |

### Validación completa

| Script | Qué hace |
| --- | --- |
| `pnpm ci` | `lint && typecheck && test:coverage` — la misma secuencia que corre el workflow de CI (ver [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)), pensada para fallar temprano: si algo falla, no sigue con el resto. Correla antes de abrir un PR. |

### Base de datos (Drizzle)

| Script | Qué hace |
| --- | --- |
| `pnpm db:generate` | Genera una nueva migración a partir de cambios en `src/db/schema/`. |
| `pnpm db:migrate` | Aplica las migraciones pendientes contra `DATABASE_URL`. |
| `pnpm db:push` | Sincroniza el schema directo a la base, sin generar migración (solo para prototipado local). |
| `pnpm db:check` | Valida consistencia entre las migraciones generadas. |
| `pnpm db:drop` | Elimina una migración generada. |
| `pnpm db:seed` | Carga datos de prueba (`src/db/seed.ts`). |
| `pnpm db:studio` | Abre Drizzle Studio para inspeccionar la base visualmente. |

### Docker

| Script | Qué hace |
| --- | --- |
| `pnpm docker:up` | Levanta los contenedores definidos en `docker-compose.yml` en segundo plano. |
| `pnpm docker:down` | Baja los contenedores. |
| `pnpm docker:build` | Construye la imagen de la app a partir del `Dockerfile`. |

---

## Flujo y metodología de trabajo

| Rama         | Descripción                             |
| ------------ | --------------------------------------- |
| `main`       | Versión final de producción             |
| `dev`        | Integración de todas las features       |
| `feature/*`  | Nuevas funcionalidades                  |
| `refactor/*` | Mejoras y reestructuración del código   |
| `docs/*`     | Cambios en documentación                |
| `fix/*`      | Corrección de errores                   |
| `chore/*`    | Tareas de mantenimiento y configuración |
| `test/*`     | Pruebas unitarias                       |

### Del cambio al merge

1. **Cambio acotado** en una rama `feature/*` (o `fix/*`, `refactor/*`, etc.) desde `dev`.
2. **Validación local**: `pnpm ci` antes de pushear (ver [Scripts disponibles](#scripts-disponibles)).
3. **Pull Request** contra `dev`, con una descripción que se pueda revisar sin pedirle contexto al autor.
4. **CI automática**: el push/PR dispara el mismo chequeo (`lint`, `typecheck`, `test`, `build`) vía GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)). Reusar los mismos comandos en local y en CI evita que algo pase en una máquina y falle en la otra.
5. **Merge** solo si CI pasa y el PR tiene revisión. `main` se reserva para versiones listas para desplegar.

---

## Convención de commits

| Prefijo     | Uso                                                   |
| ----------- | ----------------------------------------------------- |
| `feat:`     | Nueva funcionalidad                                   |
| `fix:`      | Corrección de bug                                     |
| `docs:`     | Cambios en documentación                              |
| `style:`    | Cambios de formato o estilo de código                 |
| `refactor:` | Reorganización de código                              |
| `chore:`    | Configuración, dependencias o tareas de mantenimiento |

---

## Tecnologías utilizadas

### Framework y lenguaje

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Estilos

- [Tailwind CSS](https://tailwindcss.com/)
- [class-variance-authority](https://cva.style/)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### Base de datos

- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [pg](https://node-postgres.com/)

### Manejo de estado

- [Zustand](https://zustand-demo.pmnd.rs/)

### Formularios y validación

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

### Autenticación

- [Auth.js](https://authjs.dev/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Almacenamiento de archivos

- [Cloudinary](https://cloudinary.com/)

### Testing

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jsdom](https://github.com/jsdom/jsdom)

### Calidad de código

- [Biome](https://biomejs.dev/)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Commitlint](https://commitlint.js.org/)

### Contenedores

- [Docker](https://www.docker.com/)

### Package manager

- [pnpm](https://pnpm.io/)

### Íconos

- [Lucide React](https://lucide.dev/)

### Notificaciones

- [Sileo](https://sileo.aaryan.design/)

### Deploy

- [Vercel](https://vercel.com/)
- [Neon](https://neon.tech/)

---

## Más información

Este README cubre lo necesario para instalar, levantar y entender el proyecto a alto nivel. Para profundizar:

- [`docs/README.md`](./docs/README.md) — índice completo de la documentación.
- [`docs/architecture.md`](./docs/architecture.md) — cómo están organizadas las capas y cómo fluye una operación de punta a punta.
- [`docs/api.md`](./docs/api.md) — contrato de cada Server Action y Route Handler (entrada, salida, errores).
- [`docs/testing/`](./docs/testing/) — qué se testea, por qué y con qué nivel (unitario, integración, E2E) para los casos principales del proyecto.
- [`docs/design-patterns/`](./docs/design-patterns/) y [`docs/design-principles/`](./docs/design-principles/) — decisiones de diseño: qué se evaluó, qué se eligió y qué costo se aceptó.

---

<div align="center">

_Proyecto académico — Metodología de Sistemas II, UTN_

</div>
