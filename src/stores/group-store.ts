import { createStore } from 'zustand';

import type { Group } from '@/types';

export interface GroupStore {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  selectedGroup: Group;
  setSelectedGroup: (group: Group) => void;
}

export const createGroupStore = (initialGroups: Group[]) => {
  return createStore<GroupStore>((set) => ({
    groups: initialGroups,
    selectedGroup: initialGroups[0]!,
    setGroups: (groups) => set({ groups }),
    setSelectedGroup: (group) => set({ selectedGroup: group })
  }));
};
