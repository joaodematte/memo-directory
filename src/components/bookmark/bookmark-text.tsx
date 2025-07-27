import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon, FileIcon } from 'lucide-react';

import { Kbd } from '@/components/ui/kbd';
import { isValidWebColor } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkTextProps extends React.ComponentProps<'button'> {
  bookmark: Bookmark;
  isCopying: boolean;
  isEditing: boolean;
  inputValue: string;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  onEditInputChange: (value: string) => void;
}

export function BookmarkText({
  bookmark,
  isCopying,
  isEditing,
  inputValue,
  editInputRef,
  onEditInputChange,
  ...props
}: BookmarkTextProps) {
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onEditInputChange(event.target.value);
  };

  const isColor = isValidWebColor(inputValue);

  return (
    <button {...props}>
      {isCopying ? (
        <CheckIcon className="text-muted-foreground size-4 shrink-0" />
      ) : isColor ? (
        <div
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: inputValue }}
        />
      ) : (
        <FileIcon className="text-muted-foreground size-4 shrink-0" />
      )}
      {isEditing ? (
        <input
          ref={editInputRef}
          className="field-sizing-content max-w-xs shrink-0 truncate focus-visible:outline-none"
          value={inputValue}
          onChange={handleEditInputChange}
        />
      ) : (
        <span className="max-w-xs shrink-0 truncate">
          {isCopying ? 'Copied' : inputValue}
        </span>
      )}
      <Kbd
        className={cn('ml-auto hidden', 'group-focus-visible/item:flex')}
        size="sm"
        keys={['⌘', 'C']}
      />
      <time
        dateTime={bookmark.createdAt.toISOString()}
        className={cn(
          'text-muted-foreground ml-auto shrink-0 text-xs',
          'group-focus-visible/item:hidden'
        )}
      >
        {dayjs(bookmark.createdAt).fromNow()}
      </time>
    </button>
  );
}
