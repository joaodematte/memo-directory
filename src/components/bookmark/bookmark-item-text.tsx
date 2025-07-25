import type { inferProcedureInput } from '@trpc/server';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileIcon } from 'lucide-react';
import { useState } from 'react';

import { CommandShortcut } from '@/components/cmdk';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { useUpdateBookmarkMutation } from '@/hooks/use-update-bookmark-mutation';
import { isValidWebColor } from '@/lib/color';
import type { AppRouter } from '@/server/api/root';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkItemTextProps extends Bookmark {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function BookmarkItemText({
  id,
  content,
  createdAt,
  inputRef
}: BookmarkItemTextProps) {
  const { selectedGroup } = useGroup();
  const { selectedBookmark, isEditMode } = useBookmark();

  const [inputValue, setInputValue] = useState<string>(content);

  const { mutateAsync: updateBookmark } = useUpdateBookmarkMutation();

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
      content: inputValue,
      groupId: selectedGroup.id
    });
  };

  const isColor = isValidWebColor(inputValue);
  const isEditing = isEditMode && selectedBookmark?.id === id;

  return (
    <>
      {isColor ? (
        <div className="size-4" style={{ backgroundColor: inputValue }} />
      ) : (
        <FileIcon className="text-muted-foreground size-4" />
      )}
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
