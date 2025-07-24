/* eslint-disable @next/next/no-img-element */
import type { User } from 'better-auth';
import {
  ChevronsUpDownIcon,
  CircleQuestionMark,
  LogOutIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuShortcut,
  MenuTrigger
} from '@/components/ui/menu';
import { authClient } from '@/lib/auth-client';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const handleLogOut = async () => {
    await authClient.signOut();
  };

  const username = user.email.split('@')[0] ?? '';
  const userImage = user.image ?? '';

  return (
    <Menu>
      <MenuTrigger
        render={(props) => (
          <Button size="sm" variant="ghost" {...props}>
            <img
              src={userImage}
              alt="User profile picture"
              className="size-5 rounded-full"
            />
            <span className="ml-1">{username}</span>
            <ChevronsUpDownIcon
              className="text-muted-foreground size-3"
              strokeWidth={2.5}
            />
          </Button>
        )}
      />
      <MenuContent align="end">
        <MenuItem>
          <CircleQuestionMark strokeWidth={2.5} />
          Help
          <MenuShortcut>
            <Kbd>1</Kbd>
          </MenuShortcut>
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <LogOutIcon strokeWidth={2.5} />
          Log out
          <MenuShortcut>
            <Kbd>2</Kbd>
          </MenuShortcut>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
