# Testing de posts de tipo snippet

## Regla de negocio

Un post de tipo `snippet` debe incluir obligatoriamente:

- Código fuente.
- Lenguaje de programación.

Además, el código no puede superar los 10.000 caracteres y el lenguaje no puede superar los 40 caracteres.

## Importancia de la regla

Los snippets representan publicaciones de código dentro de DevHub. Esta regla protege la utilidad y consistencia de la funcionalidad, ya que permite:

- Mostrar correctamente el bloque de código.
- Evitar publicaciones incompletas.
- Mantener datos consistentes en la base de datos.

Un cambio accidental en la validación podría permitir snippets sin código, sin lenguaje o con información que la interfaz no pueda representar correctamente.

## Casos de prueba

| Caso | Entrada | Resultado esperado | Nivel |
|---|---|---|---|
| Snippet válido | Código y lenguaje válidos | La validación es exitosa | Unitario |
| Código en el límite | Código de 10.000 caracteres | La validación es exitosa | Unitario |
| Código excedido | Código de 10.001 caracteres | La validación falla | Unitario |
| Lenguaje en el límite | Lenguaje de 40 caracteres | La validación es exitosa | Unitario |
| Lenguaje excedido | Lenguaje de 41 caracteres | La validación falla | Unitario |
| Sin código | `codeSnippet` ausente o vacío | La validación falla | Unitario |
| Sin lenguaje | `codeLanguage` ausente o vacío | La validación falla | Unitario |
| Persistencia | Snippet válido de un usuario autenticado | Se guarda correctamente en PostgreSQL | Integración |
| Recorrido completo | Usuario crea un snippet desde la interfaz | El snippet aparece en el feed | E2E |

## Tests unitarios

### Archivo

```text
src/tests/unit/post.test.ts
```

### Qué verifican

Los tests unitarios prueban `createPostSchema` de forma aislada, sin base de datos ni interfaz:

- Snippet válido.
- Código y lenguaje obligatorios.
- Campos vacíos.
- Límite máximo del código.
- Límite máximo del lenguaje.
- Exceso de longitud.
- Tags dentro y fuera del límite permitido.

### Ejecución

```bash
pnpm test:unit
```

## Tests de integración

### Archivo

```text
src/tests/integration/create-snippet.test.ts
```

### Qué verifican

Comprueban que los componentes reales colaboren correctamente:

- Acción `createPost`.
- Validación del schema.
- Drizzle ORM.
- PostgreSQL.
- Tabla `posts`.

El test crea un usuario de prueba, simula su sesión y persiste un snippet válido en la base de datos. Luego consulta el registro guardado y verifica el código, el lenguaje, el contenido, el usuario y el tipo de post.

### Dependencias aisladas

Se mockean:

- `auth`, para controlar la identidad del usuario autenticado.
- `revalidatePath`, porque es infraestructura de Next.js y no forma parte del comportamiento que se quiere verificar.

### Dependencias integradas

Se mantienen reales:

- `createPost`.
- `createPostSchema`.
- Drizzle ORM.
- PostgreSQL.
- Tabla `posts`.

No se mockea la base de datos porque se necesita comprobar la colaboración real entre la acción, el ORM y PostgreSQL.

### Requisitos

```bash
docker compose up -d db
pnpm db:migrate
```

### Ejecución

```bash
pnpm test:integration
```

## Tests End-to-End

### Archivo

```text
src/tests/e2e/create-snippet.spec.ts
```

### Qué verifican

El test comprueba el recorrido completo desde la interfaz:

1. Crear una cuenta de prueba.
2. Acceder al feed.
3. Abrir el formulario de publicación.
4. Seleccionar el tipo `snippet`.
5. Completar título, contenido, código y lenguaje.
6. Publicar.
7. Recargar el feed.
8. Verificar que el contenido, el código y el lenguaje aparecen publicados.

El E2E no mockea la base de datos ni la interfaz. Prueba el sistema completo como lo utilizaría una persona.

### Ejecución

```bash
pnpm test:e2e
```

## Estructura Arrange → Act → Assert

Los tests siguen esta estructura:

- **Arrange:** preparar usuarios, sesión, entradas y base de datos.
- **Act:** ejecutar el schema, `createPost` o el flujo de interfaz.
- **Assert:** comparar el resultado observado con el esperado.

## Verificación y límites de la evidencia

Estos tests verifican que la implementación respeta el contrato definido para los snippets y que la publicación funciona en la interfaz.

Sin embargo, los tests no garantizan la ausencia absoluta de errores. No se prueban todas las combinaciones posibles de datos ni todos los recorridos de la aplicación.

El test unitario detecta errores de validación rápidamente, el test de integración comprueba la persistencia real y el E2E verifica el flujo crítico del usuario.




