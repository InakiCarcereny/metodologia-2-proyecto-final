import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { BookmarksFeed } from '@/components/BookmarksFeed';
import { BookmarksTabs } from '@/components/BookmarksTabs';
import {
  FEED_PAGE_SIZE,
  getBookmarkCounts,
  getBookmarkedPosts,
} from '@/data/post';

export default async function Bookmarks(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const idUser = session.user.id;

  const [counts, allPosts, snippetPosts, articlePosts, questionPosts] =
    await Promise.all([
      getBookmarkCounts(idUser),
      getBookmarkedPosts({ idUser }),
      getBookmarkedPosts({ idUser, type: 'snippet' }),
      getBookmarkedPosts({ idUser, type: 'article' }),
      getBookmarkedPosts({ idUser, type: 'question' }),
    ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[#171b22]">Guardados</h1>

        <span className="font-light text-[#7e8288] text-[13px]">
          {counts.all} {counts.all === 1 ? 'elemento' : 'elementos'}
        </span>
      </div>

      <BookmarksTabs
        allSlot={
          <BookmarksFeed
            emptyMessage="Todavía no guardaste nada."
            filter="all"
            initialHasMore={allPosts.length === FEED_PAGE_SIZE}
            initialPosts={allPosts}
            key="all"
          />
        }
        articleSlot={
          <BookmarksFeed
            emptyMessage="Todavía no guardaste artículos."
            filter="article"
            initialHasMore={articlePosts.length === FEED_PAGE_SIZE}
            initialPosts={articlePosts}
            key="article"
          />
        }
        counts={counts}
        questionSlot={
          <BookmarksFeed
            emptyMessage="Todavía no guardaste preguntas."
            filter="question"
            initialHasMore={questionPosts.length === FEED_PAGE_SIZE}
            initialPosts={questionPosts}
            key="question"
          />
        }
        snippetSlot={
          <BookmarksFeed
            emptyMessage="Todavía no guardaste snippets."
            filter="snippet"
            initialHasMore={snippetPosts.length === FEED_PAGE_SIZE}
            initialPosts={snippetPosts}
            key="snippet"
          />
        }
      />
    </div>
  );
}
