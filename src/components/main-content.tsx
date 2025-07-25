'use client';

import { BookmarkInput } from '@/components/bookmark/bookmark-input';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MainContent() {
  return (
    <div className="my-24">
      <div className="px-4">
        <BookmarkInput
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

      <ScrollArea className="h-[436px]">
        <BookmarkList />
      </ScrollArea>
    </div>
  );
}
