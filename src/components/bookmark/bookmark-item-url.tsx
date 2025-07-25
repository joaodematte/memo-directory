/* eslint-disable @next/next/no-img-element */
import type { inferProcedureInput } from '@trpc/server';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';

import { CommandShortcut } from '@/components/cmdk';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { useUpdateBookmarkMutation } from '@/hooks/use-update-bookmark-mutation';
import { getHostname } from '@/lib/url';
import type { AppRouter } from '@/server/api/root';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

function getFaviconUrl(url: string, size: number) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
}

interface BookmarkItemUrlProps extends Bookmark {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function BookmarkItemUrl({
  id,
  title,
  content,
  createdAt,
  inputRef
}: BookmarkItemUrlProps) {
  const { selectedGroup } = useGroup();
  const { selectedBookmark, isEditMode } = useBookmark();

  const [inputValue, setInputValue] = useState<string>(title ?? '');

  const { mutateAsync: updateBookmark } = useUpdateBookmarkMutation();

  const isEditing = isEditMode && selectedBookmark?.id === id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputOnKeyDown = async (e: React.KeyboardEvent) => {
    const trimmedValue = inputValue.trim();

    if (
      e.key !== 'Enter' ||
      trimmedValue === '' ||
      document.activeElement !== inputRef.current
    )
      return;

    await updateBookmark({
      id,
      title: inputValue,
      groupId: selectedGroup.id
    });
  };

  return (
    <>
      <img
        src={getFaviconUrl(content, 24)}
        alt="Website's favicon"
        className="size-4"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputOnKeyDown}
          className="field-sizing-content max-w-xs truncate outline-none"
        />
      ) : (
        <span className="max-w-xs truncate">{inputValue}</span>
      )}
      <span className="text-muted-foreground max-w-64 truncate">
        {getHostname(content)}
      </span>
      <CommandShortcut>
        <Kbd className="w-8 not-in-data-[selected=true]:hidden">Ctrl</Kbd>
        <Kbd className="not-in-data-[selected=true]:hidden">C</Kbd>
      </CommandShortcut>
      <time className="text-muted-foreground shrink-0 text-xs in-data-[selected=true]:hidden">
        {dayjs(createdAt).fromNow()}
      </time>
    </>
  );
}
