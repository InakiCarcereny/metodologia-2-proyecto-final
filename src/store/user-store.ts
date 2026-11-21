import { create } from 'zustand';
import type { UserCardData } from '@/types/user';

interface UserStore {
  clearUser: () => void;
  setUser: (user: UserCardData) => void;
  user: UserCardData | null;
}

export const useUserStore = create<UserStore>((set) => ({
  clearUser: () => set({ user: null }),
  setUser: (user) => set({ user }),
  user: null,
}));
