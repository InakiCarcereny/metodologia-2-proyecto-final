import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';
import { PostCard } from '@/components/PostCard';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getCommentsByPost } from '@/data/comment';
import { getPostById } from '@/data/post';

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
      <Link
        className="flex items-center gap-2 text-[#7e8288] text-sm hover:text-black"
        href="/home"
      >
        <ArrowLeft size={16} />
        volver al feed
      </Link>

      <PostCard detail linked={false} post={post} />

      <CardWrapper as="section" className="flex flex-col gap-4">
        <h2 className="font-bold text-[#171b22] text-lg">
          {post.commentsCount}{' '}
          {post.commentsCount === 1 ? 'comentario' : 'comentarios'}
        </h2>

        <CommentForm idPost={post.id} />

        <CommentList idPost={post.id} threads={threads} />
      </CardWrapper>
    </div>
  );
}
