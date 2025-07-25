/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { CommandShortcut } from '@/components/cmdk';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { useUpdateBookmarkMutation } from '@/hooks/use-update-bookmark-mutation';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { getHostname } from '@/lib/url';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

function getFaviconUrl(url: string, size: number) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
}

interface BookmarkItemUrlProps extends React.ComponentProps<'button'> {
  hasCopied: boolean;
  bookmark: Bookmark;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function BookmarkItemUrl({
  bookmark,
  hasCopied,
  inputRef,
  ...props
}: BookmarkItemUrlProps) {
  const { selectedGroup } = useGroup();
  const { selectedBookmark, isEditMode, setIsEditMode } = useBookmark();

  const [inputValue, setInputValue] = useState<string>(bookmark.title ?? '');
  const lastInputValueRef = useRef<string>(bookmark.title ?? '');

  const { mutateAsync: updateBookmark } = useUpdateBookmarkMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputOnKeyDown = async (event: React.KeyboardEvent) => {
    const trimmedValue = inputValue.trim();

    if (KeyboardManager.isEscKey(event)) {
      event.preventDefault();
      clearEdits();
      return;
    }

    if (
      KeyboardManager.isEnterKey(event) &&
      trimmedValue !== '' &&
      document.activeElement === inputRef.current
    ) {
      event.preventDefault();
      await updateBookmark({
        id: bookmark.id,
        title: inputValue,
        groupId: selectedGroup.id
      }).then(() => {
        lastInputValueRef.current = trimmedValue;
      });
      return;
    }
  };

  const clearEdits = () => {
    setInputValue(lastInputValueRef.current);
    setIsEditMode(false);
  };

  const handleOnBlur = () => {
    if (!isEditMode) return;

    clearEdits();
  };

  const isEditing = isEditMode && selectedBookmark?.id === bookmark.id;

  return (
    <button onBlur={handleOnBlur} {...props}>
      {hasCopied ? (
        <CheckIcon className="text-muted-foreground size-4" />
      ) : (
        <img
          src={getFaviconUrl(bookmark.content, 24)}
          alt="Website's favicon"
          className="size-4"
        />
      )}

      {hasCopied ? (
        <span className="text-sm">Copied</span>
      ) : isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputOnKeyDown}
          className="field-sizing-content max-w-xs text-sm outline-none"
        />
      ) : (
        <span className="max-w-xs truncate text-sm">{inputValue}</span>
      )}
      <span className="text-muted-foreground max-w-64 truncate text-sm">
        {getHostname(bookmark.content)}
      </span>
      <CommandShortcut className="ml-auto not-group-focus-visible:hidden">
        <Kbd className="w-8">Ctrl</Kbd>
        <Kbd>C</Kbd>
      </CommandShortcut>
      <time className="text-muted-foreground ml-auto shrink-0 text-xs group-focus-visible:hidden">
        {dayjs(bookmark.createdAt).fromNow()}
      </time>
    </button>
  );
}
