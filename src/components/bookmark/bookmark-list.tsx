import { useState } from 'react';

import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGroupStore } from '@/providers/group-store-provider';
import { api } from '@/trpc/react';

import { BookmarkItem } from './bookmark-item';

export function BookmarkList() {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);

  const { data: bookmarks, isPending } = api.bookmark.getAllByGroup.useQuery({
    groupId: selectedGroup.id
  });

  const renderContent = () => {
    if (isPending) {
      return Array.from({ length: 12 }).map((_, i) => (
        <BookmarkSkeleton key={i} />
      ));
    }

    if (!bookmarks || bookmarks.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-xs">
            No bookmarks in this group.
          </p>
        </div>
      );
    }

    return bookmarks.map((item) => (
      <BookmarkItem key={item.id} bookmark={item} />
    ));
  };

  return (
    <ScrollArea className="h-[436px]">
      <div className="flex flex-col gap-2 p-2">{renderContent()}</div>
      <DeleteBookmarkDialog
        open={isDeleteBookmarkDialogOpen}
        onOpenChange={setIsDeleteBookmarkDialogOpen}
      />
    </ScrollArea>
  );
}
