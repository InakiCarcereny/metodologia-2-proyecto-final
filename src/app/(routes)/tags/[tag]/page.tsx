import type { JSX } from 'react';

export default async function Tag({
  params,
}: PageProps<'/tags/[tag]'>): Promise<JSX.Element> {
  const { tag } = await params;

  return <div>Posts de #{tag}</div>;
}
