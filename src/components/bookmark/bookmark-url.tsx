import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';

import { Kbd } from '@/components/ui/kbd';
import { getHostname } from '@/lib/url';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkUrlProps extends React.ComponentProps<'button'> {
  bookmark: Bookmark;
  isCopying: boolean;
  isEditing: boolean;
  inputValue: string;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  onEditInputChange: (value: string) => void;
}

function getFaviconUrl(url: string) {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=24`;
}

export function BookmarkUrl({
  bookmark,
  isCopying,
  isEditing,
  inputValue,
  editInputRef,
  onEditInputChange,
  ...props
}: BookmarkUrlProps) {
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onEditInputChange(event.target.value);
  };

  const faviconUrl = getFaviconUrl(bookmark.content);
  const hostname = getHostname(bookmark.content);

  return (
    <button {...props}>
      {isCopying ? (
        <CheckIcon className="text-muted-foreground size-4 shrink-0" />
      ) : (
        <Image
          src={faviconUrl}
          alt={inputValue}
          width={16}
          height={16}
          className="shrink-0"
        />
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
      <span className="text-muted-foreground hidden sm:block">{hostname}</span>
      <Kbd
        className={cn('ml-auto hidden', 'group-focus-visible/item:flex')}
        size="sm"
        keys={['⌘', 'Enter']}
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
