/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import type { inferProcedureInput } from '@trpc/server';
import { PlusIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { Command, CommandInput } from '@/components/cmdk';
import { Separator } from '@/components/ui/separator';
import { useGroup } from '@/contexts/group-context';
import { authClient } from '@/lib/auth-client';
import { isValidURL } from '@/lib/url';
import type { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';

export function MainContent() {
  const trpcUtils = api.useUtils();

  const { data: sessionData } = authClient.useSession();

  const { selectedGroup } = useGroup();

  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: bookmarks } = api.bookmark.getAllByGroup.useQuery({
    groupId: selectedGroup.id
  });

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

  const handleInputKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;

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

  const handleDocumentKeyDown = async (e: KeyboardEvent) => {
    if (
      e.ctrlKey &&
      e.key == 'v' &&
      document.activeElement !== inputRef.current
    ) {
      e.preventDefault();

      try {
        const toPaste = await navigator.clipboard.readText();

        setInputValue(toPaste.trim());
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
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

  const onValueChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="my-24">
      <Command
        value={selectedValue}
        onValueChange={onValueChange}
        shouldFilter={false}
        loop
      >
        <CommandInput
          ref={inputRef}
          placeholder="Insert an URL, color code or just plain text..."
          leadingIcon={<PlusIcon />}
          inputContainerClassName="px-4"
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
        <div className="mt-6 mb-1 flex h-6 w-full flex-col justify-between px-4">
          <div className="flex w-full justify-between">
            <span className="text-muted-foreground text-xs">Title</span>
            <span className="text-muted-foreground text-xs">Created at</span>
          </div>
          <Separator />
        </div>
        <BookmarkList bookmarks={bookmarks} />
      </Command>
    </div>
  );
}
