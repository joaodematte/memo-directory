'use client';

import type { User } from 'better-auth';

import { GroupsMenu } from '@/components/header/groups-menu';
import { UserMenu } from '@/components/header/user-menu';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-background flex w-full items-center justify-between py-6">
      <GroupsMenu />
      <UserMenu user={user} />
    </header>
  );
}
