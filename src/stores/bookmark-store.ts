import { createStore, useStore } from 'zustand';

import type { Bookmark } from '@/types';

export interface BookmarkStore {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  selectedBookmark: Bookmark | null;
  setSelectedBookmark: (bookmark: Bookmark) => void;
}

export const bookmarkStore = createStore<BookmarkStore>((set) => ({
  isEditMode: false,
  setIsEditMode: (isEditMode) => set({ isEditMode }),
  selectedBookmark: null,
  setSelectedBookmark: (bookmark) => set({ selectedBookmark: bookmark })
}));

export function useBookmarkStore<T>(selector: (store: BookmarkStore) => T): T {
  return useStore(bookmarkStore, selector);
}
