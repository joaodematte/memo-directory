'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { api } from '@/trpc/react';
import type { Group } from '@/types';

interface GroupContextProps {
  groups: Group[];
  selectedGroup: Group;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group>>;
}

interface GroupProviderProps {
  children: React.ReactNode;
  initialGroups: Group[];
}

const GroupContext = createContext<GroupContextProps | null>(null);

export function useGroup() {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error('useGroup must be used within a <GroupProvider />');
  }

  return context;
}

export function GroupProvider({ children, initialGroups }: GroupProviderProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group>(initialGroups[0]!);

  const { data: groups } = api.group.getAllByUser.useQuery();

  useEffect(() => {
    if (!groups) return;

    const selected = groups.find((gp) => gp.name === selectedGroup.name);

    if (selected && selected.id !== selectedGroup.id) {
      setSelectedGroup(selected);
    }
  }, [groups, selectedGroup.id, selectedGroup.name]);

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        setSelectedGroup,
        groups: groups ?? initialGroups
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
