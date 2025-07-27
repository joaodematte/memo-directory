'use client';

import { useCallback, useState } from 'react';

import { BookmarkInput } from '@/components/bookmark/bookmark-input';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MainContent() {
  const [bookmarkInputValue, setBookmarkInputValue] = useState<string>('');

  const handleBookmarkInputOnChange = useCallback((value: string) => {
    setBookmarkInputValue(value);
  }, []);

  return (
    <div className="my-24">
      <div className="px-3">
        <BookmarkInput
          value={bookmarkInputValue}
          onValueChange={handleBookmarkInputOnChange}
          placeholder="Paste a URL, color code or just plain text..."
          className="h-10 text-sm"
        />

        <div className="mt-6 mb-1 flex h-8 w-full flex-col border-b">
          <div className="text-muted-foreground flex w-full items-center justify-between text-xs font-medium">
            <span>Title</span>
            <span>Created at</span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[440px]">
        <BookmarkList filter={bookmarkInputValue} />
      </ScrollArea>
    </div>
  );
}
