import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';

import { Kbd } from '@/components/ui/kbd';
import { isValidWebColor } from '@/lib/color';
import { getHostname } from '@/lib/url';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

interface BookmarkItemContentProps extends React.ComponentProps<'div'> {
  bookmark: Bookmark;
}

function getFaviconUrl(url: string) {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=24`;
}

export function BookmarkItemContent({
  bookmark,
  ...props
}: BookmarkItemContentProps) {
  if (bookmark.type === 'text') {
    const isColor = isValidWebColor(bookmark.content);

    return (
      <div
        data-slot="bookmark-item-content"
        className={cn(
          'group/item flex w-full items-center gap-4 overflow-hidden rounded-md px-4 py-2 text-left text-sm',
          'group-focus-visible/item-list:data-[selected=true]:bg-accent'
        )}
        {...props}
      >
        {isColor ? (
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: bookmark.content }}
          />
        ) : (
          <FileIcon className="text-muted-foreground size-4" />
        )}
        <span className="max-w-xs truncate">{bookmark.content}</span>
        <Kbd
          className={cn(
            'ml-auto hidden',
            'group-focus-visible/item-list:group-data-[selected=true]/item:flex'
          )}
          size="sm"
          keys={['Ctrl', 'C']}
        />
        <time
          dateTime={bookmark.createdAt.toISOString()}
          className={cn(
            'text-muted-foreground ml-auto text-xs',
            'group-focus-visible/item-list:group-data-[selected=true]/item:hidden'
          )}
        >
          {dayjs(bookmark.createdAt).fromNow()}
        </time>
      </div>
    );
  }

  const faviconUrl = getFaviconUrl(bookmark.content);
  const title = bookmark.title ?? 'Title not found';
  const hostname = getHostname(bookmark.content);

  return (
    <div
      data-slot="bookmark-item-content"
      className={cn(
        'group/item flex w-full items-center gap-4 overflow-hidden rounded-md px-4 py-2 text-left text-sm',
        'group-focus-visible/item-list:data-[selected=true]:bg-accent'
      )}
      {...props}
    >
      <Image src={faviconUrl} alt={title} width={16} height={16} />
      <span className="max-w-xs truncate">{title}</span>
      <span className="text-muted-foreground">{hostname}</span>
      <Kbd
        className={cn(
          'ml-auto hidden',
          'group-focus-visible/item-list:group-data-[selected=true]/item:flex'
        )}
        size="sm"
        keys={['Ctrl', 'C']}
      />
      <time
        dateTime={bookmark.createdAt.toISOString()}
        className={cn(
          'text-muted-foreground ml-auto text-xs',
          'group-focus-visible/item-list:group-data-[selected=true]/item:hidden'
        )}
      >
        {dayjs(bookmark.createdAt).fromNow()}
      </time>
    </div>
  );
}
