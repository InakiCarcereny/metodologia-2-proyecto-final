export const FOLLOW_LIST_TABS = ['followers', 'following'] as const;

export type FollowListTab = (typeof FOLLOW_LIST_TABS)[number];

export function getFollowListTab(slug: string): FollowListTab | null {
  return (FOLLOW_LIST_TABS as readonly string[]).includes(slug)
    ? (slug as FollowListTab)
    : null;
}
