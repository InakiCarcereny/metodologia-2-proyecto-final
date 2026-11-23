## Duplicación entre `TrendingTags` y `SuggestedUsers`

**Problema**
Tener dos componentes casi idénticos duplica el costo de mantenimiento: cualquier cambio en el patrón "card con lista + link ver más" hay que replicarlo a mano en cada archivo. Es código duplicado con riesgo de *Shotgun Surgery*: si mañana cambia el diseño del link "ver más", hay que tocarlo en los dos lugares, y cada nueva sección similar (ej. "posts recientes") sumaría una tercera copia, aumentando el riesgo de que se desincronicen con el tiempo.

**Evidencia**
`TrendingTags.tsx` y `SuggestedUsers.tsx` comparten exactamente la misma estructura: `CardWrapper`, `<h2>` de título, `<ul>` que mapea un array a un subcomponente de ítem, `<Link>` final "ver más" con los mismos estilos y el mismo ícono de flecha. Lo único que cambia es el tipo de dato y el componente de ítem.

```tsx
export function TrendingTags(): JSX.Element {
  return (
    <CardWrapper as="section" className="flex flex-col gap-2">
      <h2 className="font-medium text-[#878992] text-[12px]">
        TAGS EN TENDENCIA
      </h2>

      <ul className="mt-2 mb-2 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <TrendingTagItem key={tag.label} label={tag.label} />
        ))}
      </ul>

      <Separator />

      <Link
        className="mt-2 flex items-center gap-2 font-light text-[#4265b3] text-xs"
        href="/explore"
      >
        ver más <ArrowRight color="#4265b3" size={12} />
      </Link>
    </CardWrapper>
  );
}

export function SuggestedUsers(): JSX.Element {
  return (
    <CardWrapper as="section" className="flex flex-col gap-2">
      <h2 className="font-medium text-[#878992] text-[12px]">
        USUARIOS SUGERIDOS
      </h2>

      <ul>
        {USERS.map((user) => (
          <SuggestedUserItem
            key={user.username}
            name={user.name}
            username={user.username}
          />
        ))}
      </ul>

      <Link
        className="mt-2 flex items-center gap-2 font-light text-[#4265b3] text-xs"
        href="/explore"
      >
        ver más <ArrowRight color="#4265b3" size={12} />
      </Link>
    </CardWrapper>
  );
}
```

**Cambio**
Extraer un componente genérico `ListCard<T>` que reciba `title`, `items: T[]`, `renderItem: (item: T) => ReactNode` y los datos del link final (`href`, texto). `TrendingTags` y `SuggestedUsers` quedan como wrappers que solo proveen los datos y el render de cada ítem:

```tsx
<ListCard
  title="TAGS EN TENDENCIA"
  items={TAGS}
  renderItem={(tag) => <TrendingTagItem key={tag.label} label={tag.label} />}
  moreHref="/explore"
/>
```

**Trade-off**
- *Mejora*: una sola fuente de verdad para el patrón visual/estructural. Los cambios se hacen una vez y se propagan a todos los usos.
- *Costo*: se agrega una capa extra (un componente genérico con tipos genéricos de TypeScript y una prop `renderItem`), lo que exige entender la abstracción antes de usarla.
