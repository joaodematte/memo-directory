/* eslint-disable @next/next/no-img-element */
import type { User } from 'better-auth';
import {
  ChevronsUpDownIcon,
  CircleQuestionMark,
  LogOutIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import { KeyboardManager } from '@/lib/keyboard-manager';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    await authClient.signOut().then(() => router.push('/'));
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!KeyboardManager.isNumberKey(event)) return;

    event.preventDefault();

    if (KeyboardManager.isKey(event, '1')) {
      event.preventDefault();
      setIsMenuOpen(false);
      return;
    }

    if (KeyboardManager.isKey(event, '2')) {
      event.preventDefault();
      setIsMenuOpen(false);
      await handleLogOut();
      return;
    }
  };

  const username = user.email.split('@')[0] ?? '';
  const userImage = user.image ?? '';

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
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
      <DropdownMenuContent align="end" onKeyDown={handleKeyDown}>
        <DropdownMenuItem>
          <CircleQuestionMark strokeWidth={2.5} />
          Help
          <DropdownMenuShortcut>
            <Kbd keys={['1']} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
          <LogOutIcon strokeWidth={2.5} />
          Log out
          <DropdownMenuShortcut>
            <Kbd keys={['2']} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
