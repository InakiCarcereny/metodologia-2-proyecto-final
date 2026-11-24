import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';
import { PostCard } from '@/components/PostCard';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getCommentsByPost } from '@/db/queries/comments';
import { getPostById } from '@/db/queries/posts';

export default async function PostPage({
  params,
}: PageProps<'/posts/[id]'>): Promise<JSX.Element> {
  const { id } = await params;

  const session = await auth();

  const [post, threads] = await Promise.all([
    getPostById(id, { viewerId: session?.user?.id }),
    getCommentsByPost(id),
  ]);

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PostCard detail linked={false} post={post} />

      <CardWrapper as="section" className="flex flex-col gap-4">
        <h2 className="font-medium text-[#878992] text-[12px]">RESPONDER</h2>

        <CommentForm idPost={post.id} />
      </CardWrapper>

      <CardWrapper as="section" className="flex flex-col gap-4">
        <h2 className="font-medium text-[#878992] text-[12px]">COMENTARIOS</h2>

        <CommentList idPost={post.id} threads={threads} />
      </CardWrapper>
    </div>
  );
}
