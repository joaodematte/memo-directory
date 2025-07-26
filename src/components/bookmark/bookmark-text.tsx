import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon, FileIcon } from 'lucide-react';

import { Kbd } from '@/components/ui/kbd';
import { isValidWebColor } from '@/lib/color';
import { cn } from '@/lib/utils';
import { useBookmarkStore } from '@/stores/bookmark-store';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkTextProps extends React.ComponentProps<'div'> {
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
  const isEditingMode = useBookmarkStore((state) => state.isEditMode);

  const isColor = isValidWebColor(inputValue);

  return (
    <div
      data-slot="bookmark-item-content"
      className={cn(
        'group/item flex w-full items-center gap-4 overflow-hidden rounded-md px-4 py-2 text-left text-sm',
        'data-[selected=true]:bg-accent',
        isEditing && 'bg-accent',
        isEditingMode && !isEditing && 'blur-xs'
      )}
      {...props}
    >
      {isCopying ? (
        <CheckIcon className="text-muted-foreground size-4" />
      ) : isColor ? (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: inputValue }}
        />
      ) : (
        <FileIcon className="text-muted-foreground size-4" />
      )}
      {isEditing ? (
        <input
          ref={editInputRef}
          className="field-sizing-content max-w-xs truncate focus-visible:outline-none"
          value={inputValue}
          onChange={(e) => onEditInputChange(e.target.value)}
        />
      ) : (
        <span className="max-w-xs truncate">
          {isCopying ? 'Copied' : inputValue}
        </span>
      )}
      <Kbd
        className={cn('ml-auto hidden', 'group-data-[selected=true]/item:flex')}
        size="sm"
        keys={['Ctrl', 'C']}
      />
      <time
        dateTime={bookmark.createdAt.toISOString()}
        className={cn(
          'text-muted-foreground ml-auto text-xs',
          'group-data-[selected=true]/item:hidden'
        )}
      >
        {dayjs(bookmark.createdAt).fromNow()}
      </time>
    </div>
  );
}
