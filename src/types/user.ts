import type { InferSelectModel } from 'drizzle-orm';
import type { users } from '@/db/schema';
import type { Profile } from '@/types/profile';

export type User = InferSelectModel<typeof users>;

export type UserProfile = Pick<User, 'id' | 'username' | 'createdAt'> &
  Pick<Profile, 'avatarUrl' | 'bio' | 'location' | 'website' | 'coverUrl'> & {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };

export type UserCardData = Pick<
  UserProfile,
  'id' | 'username' | 'avatarUrl' | 'postsCount'
>;
