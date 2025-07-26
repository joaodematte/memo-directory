import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';

import { Kbd } from '@/components/ui/kbd';
import { getHostname } from '@/lib/url';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkUrlProps extends React.ComponentProps<'div'> {
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
  const faviconUrl = getFaviconUrl(bookmark.content);
  const hostname = getHostname(bookmark.content);

  return (
    <div {...props}>
      {isCopying ? (
        <CheckIcon className="text-muted-foreground size-4" />
      ) : (
        <Image src={faviconUrl} alt={inputValue} width={16} height={16} />
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
      <span className="text-muted-foreground">{hostname}</span>
      <Kbd
        className={cn(
          'ml-auto hidden',
          'group-focus-visible/list:group-data-[selected=true]/item:flex'
        )}
        size="sm"
        keys={['Alt', 'Enter']}
      />
      <time
        dateTime={bookmark.createdAt.toISOString()}
        className={cn(
          'text-muted-foreground ml-auto text-xs',
          'group-focus-visible/list:group-data-[selected=true]/item:hidden'
        )}
      >
        {dayjs(bookmark.createdAt).fromNow()}
      </time>
    </div>
  );
}
