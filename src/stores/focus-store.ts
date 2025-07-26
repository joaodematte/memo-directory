import { create } from 'zustand';

interface FocusStore {
  focusedIndex: number;
  setFocusedIndex: (focusedIndex: number) => void;
}

export const useFocusStore = create<FocusStore>((set) => ({
  focusedIndex: 0,
  setFocusedIndex: (focusedIndex) => set({ focusedIndex })
}));
