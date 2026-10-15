## Constructor de posts (Builder)

**1 · Problema**
`createPost` recibe un objeto con muchos campos donde gran parte son opcionales y dependen del tipo de post: si es un snippet viajan `codeFilename`, `codeLanguage` y `codeSnippet`; si es un article esas opciones no aplican, en cambio puede llevar `imageUrl`; si es una question no lleva ninguno de los dos. Armar ese objeto a mano obliga al que llama al action a setear campos que no le corresponden como `null`, o a olvidarse de alguno y que la validación recién falle después. Las reglas de qué campo va con qué tipo quedan repartidas entre el schema de Zod, el action y el formulario, y si una cambia hay que tocar los tres lugares.

**2 · Alternativa**
Se consideraron:
- **Objeto plano + validacion Zod**: el formulario arma el objeto completo y Zod valida al final. Funciona, pero el call site sigue teniendo que saber qué campos van con cada tipo, y las reglas viven en varios lugares distintos.
- **Varios actions separados** (`createSnippetPost`, `createArticlePost`...): cada uno con su objeto. Simple, pero duplica la lógica común (título, contenido, tags, usuario) en tres partes.
- **Builder**: un objeto que se arma paso a paso con un método por cada parte y valida la coherencia recién en `build()`.

**3 · Decisión**
Se eligió el Builder porque concentra todas las reglas de "qué lleva cada tipo de post" en un solo lugar: cada tipo se construye llamando sólo a los métodos que le corresponden (`.asSnippet({...})`, `.asArticle({imageUrl})`, `.asQuestion()`), sin mandar campos en null ni campos que no aplican. El `build()` es el único encargado de revisar y validar que el objeto final esté completo y tenga sentido. Por ejemplo, que un snippet no se pueda armar si falta el código. Además, el código que llama al builder se entiende leyéndolo en una línea, sin ir a mirar el schema para saber qué campos van con cada tipo.

**4 · Costo**
El principal costo es el trade-off hay que escribir un método por cada campo del post (repetir codigo boilerplate), lo que para objetos simples o siempre iguales es más trabajo del necesario. También agrega una capa de complejidad: para entender cómo se arma un post ahora hay que leer el builder, no sólo el action.


**5 · Aclaración**
El Builder no reemplaza a Zod (Zod sigue validando los datos crudos que manda el cliente). El Builder solo se encarga de estructurar el objeto de forma coherente por dentro.
