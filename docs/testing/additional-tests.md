# Tests adicionales

Además de la regla principal sobre posts de tipo `snippet`, el proyecto cuenta con otros tests automatizados que protegen comportamientos relevantes del sistema.

Estos tests funcionan como cobertura adicional y no forman parte del caso principal seleccionado para la documentación de la actividad.

## Tests unitarios adicionales

### Validación de autenticación

Archivo:

```text
src/tests/unit/auth.test.ts
```

Verifica:

- Datos válidos de registro.
- Contraseñas que no cumplen el formato requerido.
- Usuarios demasiado cortos.
- Emails inválidos durante el login.

Estos tests prueban `registerSchema` y `loginSchema` de forma aislada.

### Formateo de URLs

Archivo:

```text
src/tests/unit/format-website-url.test.ts
```

Verifica:

- Eliminación del prefijo `www`.
- Obtención del hostname.
- Tratamiento de URLs que no pueden analizarse correctamente.

### Normalización de búsquedas

Archivo:

```text
src/tests/unit/normalize-search-query.test.ts
```

Verifica:

- Eliminación de espacios innecesarios.
- Eliminación del prefijo `@`.
- Eliminación del prefijo `#`.
- Conservación de búsquedas normales.

### Validación de posts e interacciones

Archivo:

```text
src/tests/unit/post.test.ts
```

Además de los casos específicos de snippets documentados en `snippet-post.md`, este test unitario verifica:

- La aceptación de artículos válidos.
- El rechazo de títulos vacíos.
- El límite máximo de cinco tags.
- El rechazo de más de cinco tags.
- La validación de UUIDs para interacciones con posts.

Estos casos prueban `createPostSchema` y `postInteractionSchema` de forma aislada, sin acceder a la base de datos.

## Tests de integración adicionales

### Creación de posts y tags

Archivo:

```text
src/tests/integration/create-post.test.ts
```

Este test utiliza un post de tipo `article`. Verifica la colaboración entre la acción `createPost`, Drizzle y PostgreSQL:

- Creación de un post.
- Normalización de los tags.
- Eliminación de tags duplicados.
- Persistencia de las relaciones entre posts y tags.

Este comportamiento es diferente del test de integración de snippets. `create-post.test.ts` comprueba la persistencia de artículos y sus tags, mientras que `create-snippet.test.ts` comprueba específicamente la persistencia del código y del lenguaje de un post de tipo `snippet`.

### Likes de publicaciones

Archivo:

```text
src/tests/integration/toggle-like.test.ts
```

Verifica el comportamiento de alternancia de likes:

- La primera ejecución crea el like.
- La segunda ejecución elimina el like.
- La base de datos refleja ambos estados.

## Ejecución

Los tests unitarios adicionales se ejecutan con:

```bash
pnpm test:unit
```

Los tests de integración adicionales se ejecutan con:

```bash
pnpm test:integration
```

Los tests de integración requieren PostgreSQL activo y las migraciones aplicadas.
