/* eslint-disable @next/next/no-img-element */
import type { User } from 'better-auth';
import {
  ChevronsUpDownIcon,
  CircleQuestionMark,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { HelpDialog } from '@/components/header/help-dialog';
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

  const { setTheme, theme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    await authClient.signOut().then(() => router.push('/auth'));
  };

  const toggleHelpDialog = () => {
    setIsHelpDialogOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!KeyboardManager.isNumberKey(event)) return;

    event.preventDefault();

    if (KeyboardManager.isKey(event, '1')) {
      event.preventDefault();
      toggleHelpDialog();
      setIsMenuOpen(false);
      return;
    }

    if (KeyboardManager.isKey(event, '2')) {
      event.preventDefault();
      toggleTheme();
      setIsMenuOpen(false);
      return;
    }

    if (KeyboardManager.isKey(event, '3')) {
      event.preventDefault();
      setIsMenuOpen(false);
      await handleLogOut();
      return;
    }
  };

  const username = user.email.split('@')[0] ?? '';
  const userImage = user.image ?? '';

  const themeIcon =
    theme === 'system' ? (
      <SunMoonIcon className="text-muted-foreground size-4" />
    ) : theme === 'dark' ? (
      <MoonIcon className="text-muted-foreground size-4" />
    ) : (
      <SunIcon className="text-muted-foreground size-4" />
    );

  const themeLabel =
    theme === 'system'
      ? 'System theme'
      : theme === 'dark'
        ? 'Dark theme'
        : 'Light theme';

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
        <DropdownMenuItem onClick={toggleHelpDialog}>
          <CircleQuestionMark strokeWidth={2.5} />
          Help
          <DropdownMenuShortcut>
            <Kbd keys={['1']} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {themeIcon}
          {themeLabel}
          <DropdownMenuShortcut>
            <Kbd keys={['2']} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
          <LogOutIcon strokeWidth={2.5} />
          Log out
          <DropdownMenuShortcut>
            <Kbd keys={['3']} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <HelpDialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    </DropdownMenu>
  );
}
