import { Calendar, Link2, MapPin } from 'lucide-react';
import type { JSX } from 'react';
import { formatJoinDate } from '@/utils/format-join-date';
import { formatWebsiteUrl } from '@/utils/format-website-url';

interface ProfileMetaProps {
  createdAt: Date;
  location: string | null;
  website: string | null;
}

export function ProfileMeta({
  createdAt,
  location,
  website,
}: ProfileMetaProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[#7e8288] text-[12px]">
      {location && (
        <span className="flex items-center gap-1">
          <MapPin size={14} />

          {location}
        </span>
      )}

      {website && (
        <a
          className="flex max-w-40 items-center gap-1 text-[#4265b3]"
          href={website}
          rel="noreferrer"
          target="_blank"
        >
          <Link2 className="shrink-0" size={14} />

          <span className="truncate">{formatWebsiteUrl(website)}</span>
        </a>
      )}

      <span className="flex items-center gap-1">
        <Calendar size={14} />
        se unió en {formatJoinDate(createdAt)}
      </span>
    </div>
  );
}
