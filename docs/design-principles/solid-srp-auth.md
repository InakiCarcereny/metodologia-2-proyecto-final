## `authorize` en `src/auth.ts`

**Problema**
La función `authorize` mezcla acceso a datos (consulta a la DB), lógica de seguridad (comparación de password con `bcrypt`) y reglas de negocio de autenticación, todo dentro de la configuración de NextAuth. Si cambia la forma de consultar usuarios, el algoritmo de hash, o la regla de qué hace válido a un login, todas tocan el mismo bloque. Además, hace que `auth.ts`, que debería ocuparse solo de configurar NextAuth, termine conociendo detalles de implementación de la base de datos.

**Evidencia**
En `src/auth.ts`, el `authorize` del provider `Credentials` hace todo junto: consulta `users` por email, valida que el usuario exista y tenga `passwordHash`, compara el password con `bcrypt`, y decide el retorno.

```ts
providers: [
  ...authConfig.providers.filter((p) => p.name !== 'credentials'),
  Credentials({
    authorize: async (credentials) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, credentials.email as string));

      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(
        credentials.password as string,
        user.passwordHash,
      );
      if (!valid) return null;

      return user;
    },
    credentials: {
      email: { label: 'Email' },
      password: { label: 'Contraseña', type: 'password' },
    },
  }),
],
```

**Cambio**
Extraer la lógica a una función/servicio separado, por ejemplo `authenticateUser(email, password)`, que encapsule la consulta a la DB y la comparación de password, y devuelva `user | null`. `authorize` queda como un simple adaptador entre NextAuth y ese servicio:

```ts
authorize: async (credentials) =>
  authenticateUser(credentials.email as string, credentials.password as string),
```

**Trade-off**
- *Mejora*: `auth.ts` queda enfocado solo en configuración de NextAuth; la lógica de cómo se valida un usuario es testeable de forma aislada, sin levantar todo el flujo de autenticación; y si mañana cambia la fuente de usuarios o el método de hash, el cambio queda centralizado en un solo lugar.
- *Costo*: un archivo y una función más en el proyecto, y hay que decidir dónde vive ese nuevo módulo.
