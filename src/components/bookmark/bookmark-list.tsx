import { useRef, useState } from 'react';

import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { cn } from '@/lib/utils';
import { useGroupStore } from '@/providers/group-store-provider';
import { api } from '@/trpc/react';

import { BookmarkItem } from './bookmark-item';

export function BookmarkList({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  const bookmarkListRef = useRef<HTMLDivElement>(null);

  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { data: bookmarks, isPending } = api.bookmark.getAllByGroup.useQuery({
    groupId: selectedGroup.id
  });

  const toggleDeleteBookmarkDialog = () => {
    setIsDeleteBookmarkDialogOpen((prev) => !prev);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!KeyboardManager.isArrowKey(event)) return;

    event.preventDefault();
    event.stopPropagation();

    if (KeyboardManager.isArrowDownKey(event)) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % (bookmarks?.length ?? 0));
      return;
    }

    if (KeyboardManager.isArrowUpKey(event)) {
      setActiveIndex(
        (prevIndex) =>
          (prevIndex - 1 + (bookmarks?.length ?? 0)) % (bookmarks?.length ?? 0)
      );
      return;
    }
  };

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

    return bookmarks.map((item, index) => (
      <BookmarkItem
        key={item.id}
        index={index}
        bookmark={item}
        onDeleteBookmark={toggleDeleteBookmarkDialog}
        updateActiveIndex={setActiveIndex}
        data-selected={activeIndex === index}
      />
    ));
  };

  return (
    <div
      ref={bookmarkListRef}
      tabIndex={0}
      data-slot="bookmark-list"
      className={cn('group/item-list focus-visible:outline-none', className)}
      onKeyDown={onKeyDown}
      {...props}
    >
      {renderContent()}

      <DeleteBookmarkDialog
        open={isDeleteBookmarkDialogOpen}
        onOpenChange={setIsDeleteBookmarkDialogOpen}
      />
    </div>
  );
}
