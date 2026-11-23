import { create } from 'zustand';

type ModalType = 'create-post' | 'edit-profile';

interface ModalStore {
  closeModal: () => void;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  type: ModalType | null;
}

export const useModalStore = create<ModalStore>((set) => ({
  closeModal: (): void => set({ isOpen: false, type: null }),
  isOpen: false,
  openModal: (type: ModalType): void => set({ isOpen: true, type }),
  type: null,
}));
