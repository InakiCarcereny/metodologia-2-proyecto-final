<div align="center">

# DevHub

### Red social exclusiva para desarrolladores

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-%23000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-%23000000.svg?style=for-the-badge&logo=drizzle&logoColor=C5F74F)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Integrantes - Grupo N-9

Iñaki Carcereny · Valentín De Pascale · Joaquín Marcilese

</div>

---

## Descripción

**DevHub** es una red social para desarrolladores. Cada usuario cuenta con un perfil integrado con la API de GitHub, donde se muestran sus repositorios y los lenguajes de programación que más utiliza. Además, permite crear publicaciones, incluyendo posts de código con syntax highlighting.

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

Variables necesarias:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mi_app

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4. Levantar la base de datos

**Opción A — con Docker (recomendado):**

```bash
docker compose up -d db
```

**Opción B — Postgres instalado localmente:**

Asegurate de tener una instancia de Postgres corriendo y que `DATABASE_URL` en tu `.env` apunte correctamente a ella.

### 5. Aplicar las migraciones de la base de datos

```bash
pnpm drizzle-kit migrate
```

Si es la primera vez y no tenés migraciones generadas todavía:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 6. Levantar el proyecto en desarrollo

```bash
pnpm dev
```

La app va a estar disponible en [http://localhost:3000](http://localhost:3000).

### 7. (Opcional) Levantar todo con Docker

Si preferís correr la app completa (frontend + DB) en contenedores:

```bash
docker compose up --build
```

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

### Formularios y validación

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

### Autenticación

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
