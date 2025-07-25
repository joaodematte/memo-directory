import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon, FileIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { CommandShortcut } from '@/components/cmdk';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { useUpdateBookmarkMutation } from '@/hooks/use-update-bookmark-mutation';
import { isValidWebColor } from '@/lib/color';
import { KeyboardManager } from '@/lib/keyboard-manager';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkItemTextProps extends React.ComponentProps<'button'> {
  hasCopied: boolean;
  bookmark: Bookmark;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function BookmarkItemText({
  bookmark,
  hasCopied,
  inputRef,
  ...props
}: BookmarkItemTextProps) {
  const { selectedGroup } = useGroup();
  const { selectedBookmark, isEditMode, setIsEditMode } = useBookmark();

  const [inputValue, setInputValue] = useState<string>(bookmark.content);

  const lastInputValueRef = useRef<string>(bookmark.content);

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
        content: inputValue,
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
    if (isEditMode) return;

    clearEdits();
  };

  const isEditing = isEditMode && selectedBookmark?.id === bookmark.id;
  const isColor = isValidWebColor(inputValue);

  return (
    <button onBlur={handleOnBlur} {...props}>
      {hasCopied ? (
        <CheckIcon className="text-muted-foreground size-4" />
      ) : isColor ? (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: inputValue }}
        />
      ) : (
        <FileIcon className="text-muted-foreground size-4" />
      )}
      {hasCopied ? (
        <span className="text-sm">Copied</span>
      ) : isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputOnKeyDown}
          className="field-sizing-content max-w-xs truncate text-sm outline-none"
        />
      ) : (
        <span className="max-w-xs truncate text-sm">{inputValue}</span>
      )}
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
