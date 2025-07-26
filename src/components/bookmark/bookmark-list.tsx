import { useCallback, useEffect, useRef, useState } from 'react';

import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { cn } from '@/lib/utils';
import { useGroupStore } from '@/providers/group-store-provider';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useFocusStore } from '@/stores/focus-store';
import { api } from '@/trpc/react';

import { BookmarkItem } from './bookmark-item';

const isInRadixPopper = (el: Element | null): boolean => {
  while (el) {
    if (el?.hasAttribute?.('data-radix-popper-content-wrapper')) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};

function shouldIgnoreKeyboardEvent() {
  const active = document.activeElement;
  if (
    active &&
    ((active.tagName === 'INPUT' && !(active as HTMLInputElement).readOnly) ||
      active.tagName === 'TEXTAREA' ||
      (active as HTMLElement).isContentEditable ||
      isInRadixPopper(active))
  ) {
    return true;
  }

  return false;
}

export function BookmarkList({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const focusedIndex = useFocusStore((state) => state.focusedIndex);
  const setFocusedIndex = useFocusStore((state) => state.setFocusedIndex);
  const isEditMode = useBookmarkStore((state) => state.isEditMode);
  const setSelectedBookmark = useBookmarkStore(
    (state) => state.setSelectedBookmark
  );

  const bookmarkListRef = useRef<HTMLDivElement>(null);

  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);

  const { data: bookmarks, isPending } = api.bookmark.getAllByGroup.useQuery({
    groupId: selectedGroup.id
  });

  const toggleDeleteBookmarkDialog = () => {
    setIsDeleteBookmarkDialogOpen((prev) => !prev);
  };

  const focusList = useCallback(() => {
    bookmarkListRef.current?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (shouldIgnoreKeyboardEvent()) return;

      if (!KeyboardManager.isArrowKey(event) || isEditMode) return;

      event.preventDefault();
      event.stopPropagation();

      if (KeyboardManager.isArrowDownKey(event)) {
        const nextIndex = (focusedIndex + 1) % (bookmarks?.length ?? 0);
        setFocusedIndex(nextIndex);
        const bookmark = bookmarks?.[nextIndex];
        if (bookmark) setSelectedBookmark(bookmark);
        return;
      }

      if (KeyboardManager.isArrowUpKey(event)) {
        const nextIndex =
          (focusedIndex - 1 + (bookmarks?.length ?? 0)) %
          (bookmarks?.length ?? 0);
        setFocusedIndex(nextIndex);
        const bookmark = bookmarks?.[nextIndex];
        if (bookmark) setSelectedBookmark(bookmark);
        return;
      }
    },
    [bookmarks, focusedIndex, isEditMode, setFocusedIndex, setSelectedBookmark]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const renderContent = () => {
    if (isPending) {
      return Array.from({ length: 12 }).map((_, i) => (
        <BookmarkSkeleton key={i} />
      ));
    }

    if (!bookmarks || bookmarks.length === 0) {
      return (
        <div className="flex h-full items-center justify-center py-4">
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
        data-selected={focusedIndex === index}
        focusList={focusList}
        onDeleteBookmark={toggleDeleteBookmarkDialog}
      />
    ));
  };

  return (
    <div
      ref={bookmarkListRef}
      data-slot="bookmark-list"
      className={cn('group/item-list', className)}
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
