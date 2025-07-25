'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

import { createGroupStore, type GroupStore } from '@/stores/group-store';
import { api } from '@/trpc/react';
import type { Group } from '@/types';

export type GroupStoreApi = ReturnType<typeof createGroupStore>;

export const GroupStoreContext = createContext<GroupStoreApi | null>(null);

interface GroupStoreProviderProps {
  children: React.ReactNode;
  initialGroups: Group[];
}

export function useGroupStore<T>(selector: (store: GroupStore) => T): T {
  const groupStoreContext = useContext(GroupStoreContext);

  if (!groupStoreContext) {
    throw new Error('useGroupStore must be used within a GroupStoreProvider');
  }

  return useStore(groupStoreContext, selector);
}

export function GroupStoreProvider({
  children,
  initialGroups
}: GroupStoreProviderProps) {
  const storeRef = useRef<GroupStoreApi | null>(null);

  const { data: groups } = api.group.getAllByUser.useQuery();

  storeRef.current ??= createGroupStore(initialGroups);

  useEffect(() => {
    if (!groups || !storeRef.current) return;

    const { selectedGroup } = storeRef.current.getState();

    const existsInGroups = groups.some(
      (group) => group.id === selectedGroup.id
    );

    if (!existsInGroups) {
      storeRef.current.setState({
        groups,
        selectedGroup: groups[groups.length - 1]
      });

      return;
    }

    storeRef.current.setState({
      groups
    });
  }, [groups, initialGroups]);

  return (
    <GroupStoreContext.Provider value={storeRef.current}>
      {children}
    </GroupStoreContext.Provider>
  );
}
