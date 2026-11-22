import { User } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { EditProfileButton } from '@/components/EditProfileButton';
import { FollowButton } from '@/components/FollowButton';
import { ProfileMeta } from '@/components/ProfileMeta';
import { ProfileStats } from '@/components/ProfileStats';
import { Separator } from '@/components/Separator';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { UserProfile } from '@/types/user';
import { formatDisplayName } from '@/utils/format-display-name';

interface ProfileHeaderProps {
  isOwnProfile: boolean;
  profile: UserProfile;
}

export function ProfileHeader({
  isOwnProfile,
  profile,
}: ProfileHeaderProps): JSX.Element {
  return (
    <CardWrapper
      as="section"
      className="flex flex-col gap-0 overflow-hidden p-0"
    >
      <div className="h-48 w-full bg-linear-to-r from-[#171b22] to-[#303540]">
        {profile.coverUrl && (
          <Image
            alt={`${profile.username} portada`}
            className="h-full w-full object-cover"
            height={128}
            loading="eager"
            src={profile.coverUrl}
            width={700}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-end justify-between">
          <div className="-mt-14 h-22 w-22 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white">
            {profile.avatarUrl ? (
              <Image
                alt={`${profile.username} avatar`}
                className="h-full w-full object-cover"
                height={88}
                loading="eager"
                src={profile.avatarUrl}
                width={88}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-zinc-200">
                <User color="white" size={56} />
              </span>
            )}
          </div>

          {isOwnProfile ? (
            <EditProfileButton />
          ) : (
            <FollowButton className="w-32" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-2xl">
            {formatDisplayName(profile.username)}
          </span>

          <small className="text-[#7e8288] text-[13px]">
            @{profile.username}
          </small>
        </div>

        {profile.bio && (
          <p className="font-light text-[14px] text-black">{profile.bio}</p>
        )}

        <ProfileMeta
          createdAt={profile.createdAt}
          location={profile.location}
          website={profile.website}
        />

        <Separator />

        <ProfileStats
          followersCount={profile.followersCount}
          followingCount={profile.followingCount}
          postsCount={profile.postsCount}
        />
      </div>
    </CardWrapper>
  );
}
