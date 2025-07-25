'use client';

import type { Bookmark } from '@/types';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

export function BookmarkItem({ bookmark }: BookmarkItemProps) {
  return (
    <button className="w-full text-left">
      <div>{bookmark.title ?? 'No Title'}</div>
      <div className="text-muted-foreground truncate">{bookmark.content}</div>
    </button>
  );
}
