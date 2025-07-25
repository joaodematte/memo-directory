/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import type { inferProcedureInput } from '@trpc/server';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';

import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { Input } from '@/components/ui/input';
import { useGroup } from '@/contexts/group-context';
import { authClient } from '@/lib/auth-client';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { isValidURL } from '@/lib/url';
import type { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';

export function MainContent() {
  const trpcUtils = api.useUtils();

  const { data: sessionData } = authClient.useSession();

  const { selectedGroup } = useGroup();

  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createBookmark } = api.bookmark.create.useMutation({
    onMutate: async (data) => {
      await trpcUtils.bookmark.getAllByGroup.cancel({
        groupId: selectedGroup.id
      });

      const previousBookmarks = trpcUtils.bookmark.getAllByGroup.getData({
        groupId: selectedGroup.id
      });

      if (!previousBookmarks || !sessionData) {
        console.warn(
          'No previous bookmark data or session data found in cache. Optimistic create skipped.'
        );

        return { previousBookmarks };
      }

      const newBookmark = {
        id: uuidv7(),
        type: data.type,
        title: data.content,
        content: data.content,
        userId: sessionData.user.id,
        groupId: selectedGroup.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      trpcUtils.bookmark.getAllByGroup.setData({ groupId: selectedGroup.id }, [
        newBookmark,
        ...previousBookmarks
      ]);

      setInputValue('');

      toast.success('Bookmark created');

      return { previousBookmarks, newBookmarkTempId: newBookmark.id };
    },
    onError: (err, variables, context) => {
      console.error(
        `Bookmark creation failed for content: ${variables.content}. Reverting optimistic changes.`,
        err
      );

      if (context?.previousBookmarks) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: selectedGroup.id },
          context.previousBookmarks
        );
      }
    },
    onSettled: async () => {
      await trpcUtils.bookmark.getAllByGroup.invalidate({
        groupId: selectedGroup.id
      });
    }
  });

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = async (event: React.KeyboardEvent) => {
    if (!KeyboardManager.isEnterKey(event)) return;

    event.preventDefault();

    const trimmedValue = inputValue.trim();

    if (trimmedValue === '') return;

    const values: inferProcedureInput<AppRouter['bookmark']['create']> = {
      type: 'text',
      content: trimmedValue,
      groupId: selectedGroup.id
    };

    if (isValidURL(trimmedValue)) {
      values.type = 'url';
    }

    await createBookmark(values);
  };

  const handleDocumentKeyDown = async (event: KeyboardEvent) => {
    if (ShortcutManager.isFocusInputShortcut(event)) {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }

    if (
      ShortcutManager.isPasteShortcut(event) &&
      document.activeElement !== inputRef.current
    ) {
      event.preventDefault();

      try {
        const textToPaste = await navigator.clipboard.readText();

        setInputValue(textToPaste.trim());
        inputRef.current?.focus();
      } catch {
        console.error('Unable to read clipboard');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  return (
    <div className="my-24">
      <div className="px-4">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputOnChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Paste a URL, color code or just plain text..."
          className="h-10 text-sm"
        />

        <div className="mt-6 mb-1 flex h-8 w-full flex-col border-b">
          <div className="text-muted-foreground flex w-full items-center justify-between text-xs font-medium">
            <span>Title</span>
            <span>Created at</span>
          </div>
        </div>
      </div>

      <BookmarkList />
    </div>
  );
}
