/* eslint-disable @next/next/no-img-element */
import type { User } from 'better-auth';
import {
  ChevronsUpDownIcon,
  CircleQuestionMark,
  LogOutIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { authClient } from '@/lib/auth-client';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut().then(() => router.push('/'));
  };

  const username = user.email.split('@')[0] ?? '';
  const userImage = user.image ?? '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <CircleQuestionMark strokeWidth={2.5} />
          Help
          <DropdownMenuShortcut>
            <Kbd>1</Kbd>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
          <LogOutIcon strokeWidth={2.5} />
          Log out
          <DropdownMenuShortcut>
            <Kbd>2</Kbd>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
