import type { JSX } from 'react';
import { auth } from '@/auth';
import { TagItem } from '@/components/TagItem';
import { getFollowedTagsByUser } from '@/data/tag';

export async function TagList(): Promise<JSX.Element | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tags = await getFollowedTagsByUser(session.user.id);
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="pl-2.5 font-medium text-[#878992] text-[12px]">
        TUS TAGS
      </span>

      <nav className="w-full">
        <ul className="flex w-full flex-col gap-1">
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              label={tag.label}
              path={`/tags/${tag.label}`}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
