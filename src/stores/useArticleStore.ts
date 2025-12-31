import { create } from 'zustand';

type ArticleModalState = {
  isOpen: boolean;
  editingId: string | null;
  openModal: (id?: string) => void;
  closeModal: () => void;
};

export const useArticleModal = create<ArticleModalState>(set => ({
  isOpen: false,
  editingId: null,
  openModal: id => set({ isOpen: true, editingId: id || null }),
  closeModal: () => set({ isOpen: false, editingId: null }),
}));
