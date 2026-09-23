import type { JSX } from 'react';

export default async function User({
  params,
}: PageProps<'/users/[user]'>): Promise<JSX.Element> {
  const { user } = await params;

  return <div>Perfil de {user}</div>;
}
