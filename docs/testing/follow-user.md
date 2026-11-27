# Testing de seguimiento de usuarios

## Regla de negocio

Un usuario autenticado puede seguir a otro usuario, pero no puede seguirse a sí mismo ni realizar la acción sin autenticarse.

## Importancia de la regla

El seguimiento es una interacción central de la red social. Esta regla protege la consistencia de las relaciones entre usuarios y evita:

- Relaciones de seguimiento inválidas.
- Datos inconsistentes en la tabla `followers`.
- Acciones realizadas por usuarios no autenticados.
- Estados incorrectos en los perfiles y listas de seguidores.

## Casos de prueba

| Caso | Entrada | Resultado esperado | Nivel |
|---|---|---|---|
| Seguir usuario | Usuario autenticado y otro usuario como objetivo | Se crea la relación en `followers` | Integración |
| Dejar de seguir | Usuario autenticado con una relación existente | Se elimina la relación | Integración |
| Seguirse a sí mismo | El usuario autenticado es también el objetivo | Se devuelve un error y no se crea la relación | Integración |
| Usuario no autenticado | Sesión inexistente y usuario objetivo válido | Se devuelve `No autenticado` | Integración |

## Test implementado

Archivo:

```text
src/tests/integration/follow-user.test.ts
```

El test utiliza las acciones reales `followUser` y `unfollowUser`, crea usuarios de prueba en PostgreSQL y verifica que las relaciones se creen y eliminen correctamente.

También verifica que:

- Un usuario no pueda seguirse a sí mismo.
- Un usuario no autenticado no pueda seguir a otro usuario.
- La tabla `followers` no conserve relaciones inválidas.

## Dependencias aisladas

Se mockean:

- `auth`, para controlar la sesión del usuario.
- `revalidatePath`, porque es infraestructura de Next.js.

## Dependencias integradas

Se mantienen reales:

- `followUser`.
- `unfollowUser`.
- Drizzle ORM.
- PostgreSQL.
- Tabla `followers`.
- Relaciones entre usuarios.

No se mockea la base de datos porque el objetivo es verificar la persistencia y eliminación real de las relaciones.

## Ejecución

Con PostgreSQL activo:

```bash
pnpm test:integration
```

## Limitaciones

Este test verifica la regla de negocio y la persistencia de la relación, pero no comprueba la representación visual del botón de seguimiento.

No se agrega un E2E específico porque ya existe un E2E para el flujo principal de publicación de snippets y el costo de mantener múltiples recorridos E2E no aporta suficiente valor adicional para esta funcionalidad.
