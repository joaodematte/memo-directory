import type { inferProcedureInput } from '@trpc/server';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';

import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { useCreateBookmark } from '@/hooks/use-create-bookmark';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { isValidURL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { useGroupStore } from '@/providers/group-store-provider';
import type { AppRouter } from '@/server/api/root';

type CreateBookmarkInput = inferProcedureInput<AppRouter['bookmark']['create']>;

interface BookmarkInputProps
  extends Omit<React.ComponentProps<'input'>, 'value'> {
  value: string;
  onValueChange: (value: string) => void;
}

export function BookmarkInput({
  className,
  value,
  onValueChange,
  ...props
}: BookmarkInputProps) {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createBookmark } = useCreateBookmark(() => {
    onValueChange('');
  });

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const getDataToCreateBookmark = useCallback(
    (content: string): CreateBookmarkInput => {
      const values: CreateBookmarkInput = {
        type: 'text',
        content,
        groupId: selectedGroup.id
      };

      if (isValidURL(content)) {
        values.type = 'url';
      }

      return values;
    },
    [selectedGroup.id]
  );

  const handleInputKeyDown = async (event: React.KeyboardEvent) => {
    if (!KeyboardManager.isEnterKey(event)) return;

    event.preventDefault();

    const trimmedValue = value.trim();

    if (trimmedValue === '') return;

    const mutationData = getDataToCreateBookmark(trimmedValue);

    await createBookmark(mutationData);
  };

  const keyDownHandler = useCallback(
    async (event: KeyboardEvent) => {
      const inputHasFocus = document.activeElement === inputRef.current;

      if (ShortcutManager.isFocusInputShortcut(event) && !inputHasFocus) {
        inputRef.current?.focus();

        return;
      }

      if (ShortcutManager.isPasteShortcut(event) && !inputHasFocus) {
        try {
          const textToPaste = await navigator.clipboard.readText();
          const trimmedText = textToPaste.trim();

          const mutationData = getDataToCreateBookmark(trimmedText);

          await createBookmark(mutationData);
        } catch {
          console.error('Error trying to read clipboard data.');
        }
      }
    },
    [createBookmark, getDataToCreateBookmark]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex h-full w-10 items-center justify-center gap-1">
        <PlusIcon className="text-muted-foreground size-4" />
      </div>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputOnChange}
        onKeyDown={handleInputKeyDown}
        className={cn('pr-16 pl-10', className)}
        {...props}
      />
      <Kbd
        keys={['⌘', 'K']}
        className="absolute top-1/2 right-2 -translate-y-1/2"
      />
    </div>
  );
}
