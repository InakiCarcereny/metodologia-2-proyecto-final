'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { FollowUserListItem } from '@/components/FollowUserListItem';
import { useUserStore } from '@/store/user-store';
import type { UserListItem } from '@/types/user';
import type { FollowListTab } from '@/utils/follow-tab';
import { formatDisplayName } from '@/utils/format-display-name';
import { CardWrapper } from './ui/CardWrapper';

interface FollowUserListProps {
  emptyMessage: string;
  initialUsers: UserListItem[];
  removable: boolean;
  tab: FollowListTab;
}

export function FollowUserList({
  emptyMessage,
  initialUsers,
  removable,
  tab,
}: FollowUserListProps): JSX.Element {
  const currentUser = useUserStore((s) => s.user);

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        formatDisplayName(user.username).toLowerCase().includes(query),
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-4">
      <input
        className="rounded-lg border border-[#d6d7db] bg-white p-3 font-light placeholder:text-[#95989f] focus:outline-none"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o @usuario"
        type="text"
        value={search}
      />

      {filteredUsers.length === 0 ? (
        <p className="py-6 text-center font-light text-[#7e8288] text-sm">
          {users.length === 0 ? emptyMessage : 'No se encontraron usuarios.'}
        </p>
      ) : (
        <CardWrapper as="ul" className="flex flex-col gap-2">
          {filteredUsers.map((user, index) => (
            <FollowUserListItem
              isLast={index === filteredUsers.length - 1}
              isSelf={currentUser?.id === user.id}
              key={user.id}
              onRemove={
                removable
                  ? () =>
                      setUsers((prev) => prev.filter((u) => u.id !== user.id))
                  : undefined
              }
              showFollowsViewerBadge={tab === 'following'}
              user={user}
            />
          ))}
        </CardWrapper>
      )}
    </div>
  );
}
