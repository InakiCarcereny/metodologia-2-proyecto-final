# Documentación

Índice de la documentación técnica del proyecto, organizada según para quién es cada cosa:

| Documento | Para quién | Qué responde |
| --- | --- | --- |
| [`../README.md`](../README.md) | Cualquiera que llega al repo | Qué es el proyecto, cómo instalarlo y levantarlo, qué scripts hay. |
| [`architecture.md`](./architecture.md) | Quien va a modificar el código | Cómo están organizadas las capas, cómo fluye una operación típica de punta a punta, qué entidades existen. |
| [`api.md`](./api.md) | Quien va a integrar o llamar algo | Contrato de cada Server Action y Route Handler: qué recibe, qué devuelve, qué errores puede dar. |
| [`testing/`](./testing/) | Quien revisa o extiende la cobertura de tests | Por cada caso elegido: regla de negocio, por qué importa, casos de prueba (tabla), qué se mockea y qué no, y sus límites — no solo qué archivo correr. |
| [`design-principles/`](./design-principles/) | Quien revisa o discute una refactorización | Aplicaciones puntuales de principios SOLID/Clean Code sobre código real: problema, evidencia, cambio propuesto, trade-off. |
| [`design-patterns/`](./design-patterns/) | Quien quiere entender (o cuestionar) por qué se usó tal patrón | Por cada patrón: problema, alternativas consideradas, decisión tomada y costo aceptado — no solo el patrón en sí. |

## Convención de estos documentos

- **El código no explica todas las decisiones.** `design-patterns/` y `design-principles/` documentan el *por qué* (incluyendo "por qué no" se tomó otro camino), no duplican lo que ya se lee en el código.
- **`architecture.md` y `api.md` describen el comportamiento real actual**, no un ideal a futuro. Si cambia una Server Action o se agrega una ruta nueva, el PR que la cambia actualiza el documento correspondiente en el mismo commit.
- Las imágenes referenciadas desde los docs viven en [`assets/`](./assets/).
