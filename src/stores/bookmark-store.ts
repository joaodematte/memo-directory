import { create } from 'zustand';

import type { Bookmark } from '@/types';

export interface BookmarkStore {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  selectedBookmark: Bookmark | null;
  setSelectedBookmark: (bookmark: Bookmark | null) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  isEditMode: false,
  setIsEditMode: (isEditMode) => set({ isEditMode }),
  selectedBookmark: null,
  setSelectedBookmark: (bookmark) => set({ selectedBookmark: bookmark })
}));
