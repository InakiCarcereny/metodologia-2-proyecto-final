## Estrategias de autenticación (Strategy)

**1 · Problema**
La app necesita autenticar a sus usuarios, pero no hay una única forma de hacerlo: alguien puede entrar con su cuenta de GitHub (OAuth) o con email y contraseña verificada contra nuestra base de datos. Sin el patrón, esas dos formas terminarían mezcladas en un mismo flujo lleno de `if (provider === 'github')`, o el código que llama al login tendría que saber de antemano qué método se va a usar para tomar un camino distinto cada vez. Además, cada vez que quisiéramos sumar otra forma de entrar (como Google), tendríamos que modificar código viejo corriendo el riesgo de romperlo.

**2 · Alternativa**
Se consideraron:
- **Un solo método con condicionales**: una función de login con `if/else` adentro según el tipo de credencial. Simple al principio, pero el algoritmo de GitHub y el de bcrypt no se parecen en nada, y la función crece con cada forma nueva de entrar.
- **Lógica por pantalla de login**: que cada formulario de login arme su propio flujo completo. Funciona, pero obligaría a repetir el mismo código de errores, sesiones y redirecciones en varios lugares.
- **Strategy con providers de NextAuth**: cada forma de autenticarse es una estrategia independiente que cumple la misma interfaz, y cuál se usa se decide en runtime.

**3 · Decisión**
Se eligió Strategy porque las dos formas de autenticar son algoritmos intercambiables detrás de una misma interfaz: por un lado GitHub resuelve la verificación contra un tercero (GitHub le dice a la app "este usuario es válido" y además la estrategia registra al usuario en `users`/`accounts` vía `DrizzleAdapter` sin pasar por ningún formulario), mientras que Credentials resuelve la verificación contra nuestra base de datos (`bcrypt.compare` de la contraseña contra `passwordHash`). La función principal que inicia sesión (signIn()) no necesita saber cuál de las dos se está usando:  el usuario elige la estrategia en la pantalla de login y ésta se ejecuta en runtime y, si en el futuro queremos sumar otra opción (como Google), solo agregamos un provider en el array sin romper nada de lo que ya funciona.

**4 · Costo**
El principal trade-off es que cada estrategia trae su propia complejidad: OAuth requiere configuración externa (client id/secret de GitHub, redirect URIs) y una tabla `accounts` para guardar los vínculos y tokens, mientras que Credentials requiere manejar hashes de contraseña y los riesgos de seguridad propios del login manual. También, hay que tener cuidado de no duplicar código en las cosas que comparten (como los errores o las redirecciones).