# API

> Documentación de referencia: para cada operación, qué recibe, qué devuelve y qué errores puede dar. Para ver cómo se relacionan estas capas entre sí, ver [`architecture.md`](./architecture.md).

## Por qué no hay OpenAPI/Swagger

La app no expone una API REST pública: la UI y el servidor viven en el mismo proyecto Next.js y se comunican mediante **Server Actions** (funciones de servidor invocadas directamente desde componentes de cliente, sin pasar por `fetch` ni por una ruta HTTP). Una especificación OpenAPI describe *endpoints HTTP*, y acá casi no los hay. Por eso este documento usa el mismo formato de contrato (operación → entrada → salida) pero aplicado a las dos superficies reales de la app:

1. **Route Handlers** (HTTP real, sección siguiente) — los pocos casos que sí necesitan una URL propia.
2. **Server Actions** (RPC desde la UI) — el grueso de la lógica de escritura/lectura autenticada.

---

## Route Handlers (HTTP)

### `GET /api/auth/[...nextauth]`, `POST /api/auth/[...nextauth]`

| | |
| --- | --- |
| **Operación** | Catch-all manejado por Auth.js (`handlers` de `src/auth.ts`): login, logout, callback de OAuth, sesión, CSRF, etc. |
| **Entrada** | Definida por Auth.js según la subruta (`/api/auth/signin`, `/api/auth/callback/github`, `/api/auth/session`, ...). No se implementa a mano. |
| **Salida** | Definida por Auth.js. Incluye el set de la cookie de sesión. |

### `GET /api/github/connect`

| | |
| --- | --- |
| **Operación** | Inicia el flujo OAuth para **vincular** una cuenta de GitHub a un usuario ya logueado (distinto del login con GitHub). |
| **Contrato de entrada** | Ninguno en el request. Requiere sesión activa (cookie de Auth.js). |
| **Contrato de salida** | `302` a `github.com/login/oauth/authorize` con `client_id`, `redirect_uri` y un `state` aleatorio. Si no hay sesión → `302` a `/login`. Setea cookie `httpOnly` con el `state` (expira a los 10 min) para validarlo en el callback. |

### `GET /api/github/connect/callback`

| | |
| --- | --- |
| **Operación** | Callback del paso anterior: intercambia el `code` por un token, obtiene el usuario de GitHub y vincula la cuenta. |
| **Contrato de entrada** | Query params `code` y `state` (los manda GitHub). Cookie `state` guardada en el paso anterior. Requiere sesión activa. |
| **Contrato de salida** | `302` a `/profile?githubLinked=1` si se vinculó. Errores, todos como redirect con query param para que la UI muestre el mensaje: `?githubError=invalid-state` (state no coincide), `?githubError=already-linked` (esa cuenta de GitHub ya está vinculada a otro usuario), `?githubError=unknown` (fallo de red/API). |

---

## Server Actions

> Todas viven en `src/actions/`, son `async function` marcadas `'use server'`, y validan sesión con `auth()` antes de tocar la base. El patrón de retorno es consistente: `{ success: true }` / el dato pedido, o `{ error: string }`.

### Autenticación — `src/actions/auth.ts`

#### `register(values: RegisterFormValues)`

| | |
| --- | --- |
| **Contrato de entrada** | `{ email: string, username: string, password: string }` — validado con `registerSchema` (Zod): email válido, username ≥ 3 caracteres, password ≥ 8 con al menos una mayúscula y un número. |
| **Contrato de salida** | `{ success: true }` tras crear el usuario, su `profile` vacío e iniciar sesión. Errores: `"Datos inválidos"`, `"Ese correo ya está registrado"`, `"Ese usuario ya está en uso"`, `"No se pudo crear la cuenta"`, `"Cuenta creada, pero no se pudo iniciar sesión"`. |

#### `login(values: LoginFormValues)`

| | |
| --- | --- |
| **Contrato de entrada** | `{ email: string, password: string }` — validado con `loginSchema`. |
| **Contrato de salida** | `{ success: true }` o `{ error: "Correo o contraseña incorrectos" \| "Algo salió mal" \| "Datos inválidos" }`. |

#### `loginWithGithub()`

| | |
| --- | --- |
| **Contrato de entrada** | Ninguno. |
| **Contrato de salida** | No retorna: redirige (`signIn('github')`) a `/home` tras el flujo OAuth de login. |

### Posts — `src/actions/posts.ts`

#### `createPost(input: CreatePostInput)`

| | |
| --- | --- |
| **Contrato de entrada** | `title` (1–200 car.), `content` (1–5000 car.), `type: 'snippet' \| 'question' \| 'article'`, `tags?` (máx. 5, 30 car. c/u), y para `type: 'snippet'` son obligatorios `codeSnippet`, `codeLanguage` (y opcional `codeFilename`); `imageUrl?` para artículos con imagen. Validado con `createPostSchema` (ver [Builder](./design-patterns/creational/builder.md) para el porqué de esta forma condicional). Requiere sesión. |
| **Contrato de salida** | `{ post }` (fila insertada) tras crear el post y sus tags en una transacción. Errores: `"No autenticado"`, errores de campo (`fieldErrors` de Zod), `"No se pudo publicar el post"`. |

#### `toggleLike`, `toggleBookmark`, `repostPost` — `(input: PostInteractionInput)`

| | |
| --- | --- |
| **Contrato de entrada** | `{ idPost: string (uuid) }`. Requiere sesión. |
| **Contrato de salida** | Insertan o eliminan la fila de interacción (toggle) y devuelven el nuevo estado: `{ liked: boolean }`, `{ bookmarked: boolean }` o `{ reposted: boolean }` respectivamente. Error común: `"No autenticado"`, `"ID de post inválido"`, o el mensaje específico de cada una (`"No se pudo procesar el like"`, etc.). |

#### `fetchMoreFeedPosts({ offset: number, tab: 'for-you' | 'following' })`

| | |
| --- | --- |
| **Contrato de entrada** | `offset` (paginación) y `tab` (`'for-you'` = todos los posts en orden cronológico, `'following'` = solo de usuarios seguidos). |
| **Contrato de salida** | `{ hasMore: boolean, posts: Post[] }` (página de tamaño `FEED_PAGE_SIZE = 20`) o `{ error: "No se pudieron cargar más posts" }`. |

#### `fetchMoreBookmarks({ offset: number, filter: 'all' | PostType })`

| | |
| --- | --- |
| **Contrato de entrada** | `offset` y `filter` para filtrar guardados por tipo de post. Requiere sesión. |
| **Contrato de salida** | `{ hasMore: boolean, posts: Post[] }` o `{ error: string }` (`"No autenticado"` / `"No se pudieron cargar más guardados"`). |

### Comentarios — `src/actions/comments.ts`

#### `createComment(input: CreateCommentInput)`

| | |
| --- | --- |
| **Contrato de entrada** | `{ idPost: string (uuid), content: string (1–2000 car.), idParent?: string (uuid) }` — `idParent` para responder a otro comentario. Requiere sesión. |
| **Contrato de salida** | `{ comment }` tras insertar y revalidar `/posts/[id]` y `/home`. Errores: `"No autenticado"`, `fieldErrors`, `"No se pudo publicar el comentario"`. |

### Perfil — `src/actions/profile.ts`

| Función | Entrada | Salida |
| --- | --- | --- |
| `getMyProfile()` | — (usa sesión) | `UserProfile \| null` |
| `getFollowersList(userId: string)` | `userId` | `UserListItem[]` |
| `getFollowingList(userId: string)` | `userId` | `UserListItem[]` |
| `updateProfile(values: EditProfileFormValues)` | `{ bio?, location?, website? }` (website debe empezar con `http(s)://`, validado con Zod) | `{ success: true }` o `{ error: "No autenticado" \| "Datos inválidos" }` |
| `updateAvatar(url: string)` | URL de imagen ya subida a Cloudinary | `{ success: true }` o `{ error: "No autenticado" }` |
| `updateCover(url: string)` | URL de imagen ya subida a Cloudinary | `{ success: true }` o `{ error: "No autenticado" }` |

### Seguir usuarios — `src/actions/follow.ts`

| Función | Entrada | Salida |
| --- | --- | --- |
| `followUser(targetUserId: string)` | id del usuario a seguir | `{ success: true }` o `{ error: "No autenticado" \| "No podés seguirte a vos mismo" }` |
| `unfollowUser(targetUserId: string)` | id del usuario a dejar de seguir | `{ success: true }` o `{ error: "No autenticado" }` |
| `removeFollower(followerId: string)` | id del seguidor a quitar de mis seguidores | `{ success: true }` o `{ error: "No autenticado" }` |

### Tags — `src/actions/tag.ts`

| Función | Entrada | Salida |
| --- | --- | --- |
| `followTag(tagId: string)` | id del tag | `{ success: true }` o `{ error: "No autenticado" }` |
| `unfollowTag(tagId: string)` | id del tag | `{ success: true }` o `{ error: "No autenticado" }` |

### Imágenes — `src/actions/upload.ts`

#### `uploadImage(formData: FormData)`

| | |
| --- | --- |
| **Contrato de entrada** | `FormData` con un campo `file` (imagen). No valida sesión a nivel de action (se usa solo desde formularios ya protegidos por la página). |
| **Contrato de salida** | `{ url: string, publicId: string }` (resultado de Cloudinary). Tira excepción (`"No se recibió ningún archivo"`) si falta el archivo — a diferencia del resto de las actions, acá sí se espera que el caller la capture. |

### Sesión — `src/actions/logout.ts`

#### `logoutAction()`

| | |
| --- | --- |
| **Contrato de entrada** | Ninguno. |
| **Contrato de salida** | No retorna: cierra sesión y redirige a `/login`. |
