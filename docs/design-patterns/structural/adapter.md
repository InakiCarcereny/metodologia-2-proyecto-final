## API de GitHub (Adapter)

> Esta es una decisión de diseño futura: todavía no se implementó la integración con la API de GitHub, pero se documenta de antemano el enfoque que se va a seguir cuando se agregue.

**1 · Problema**
Necesitamos mostrar los repos del usuario, sus lenguajes más usados, estrellas, etc, obtenidos de la API de GitHub. El problema es que la forma de los datos que devuelve GitHub no es la que le conviene al resto de la app. Si cada componente consume directamente la respuesta cruda de la API, toda la aplicación queda atada al contrato de GitHub: cualquier cambio en la API (un campo que se renombra, una nueva versión del endpoint) obligaría a tocar código en múltiples lugares.

**2 · Alternativa**
Se consideraron:

- **Consumir la respuesta de GitHub directamente** en los componentes. Es lo más rápido de implementar, pero acopla toda la UI al formato específico de la API externa.
- **Adapter**: centralizar la traducción del formato de GitHub a un modelo propio de la app, en un módulo.

**3 · Decisión**
Se eligió el Adapter porque desacopla el modelo interno de la app del contrato externo de la API de GitHub. Los componentes y el resto de la lógica de negocio trabajan siempre contra una interfaz propia, sin conocer ni importarles cómo responde GitHub. Si GitHub cambia su respuesta, o si más adelante se agrega otra fuente de datos, solo se modifica o se agrega un Adapter, y el resto de la app no se entera del cambio.

**4 · Costo**
El costo es una capa extra: por cada entidad que viene de GitHub (repos, lenguajes, usuario) hay que mantener una interfaz interna y su función de adaptación, lo que implica más archivos y algo de código repetitivo de mapeo. Para un dato puntual y simple, puede sentirse como sobre-ingeniería. En este proyecto se justifica porque la app tiene rutas, donde la UI esta muy atada a una API externa que no controlamos, donde un simple cambio en la API podría romper la UI si no tuviéramos el Adapter.
