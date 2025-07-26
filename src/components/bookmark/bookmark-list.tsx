import { keepPreviousData } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { cn } from '@/lib/utils';
import { useGroupStore } from '@/providers/group-store-provider';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useFocusStore } from '@/stores/focus-store';
import { api } from '@/trpc/react';

import { BookmarkItem } from './bookmark-item';

interface BookmarkListProps extends React.ComponentProps<'div'> {
  filter: string;
}

export function BookmarkList({
  className,
  filter,
  ...props
}: BookmarkListProps) {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const focusedIndex = useFocusStore((state) => state.focusedIndex);
  const setFocusedIndex = useFocusStore((state) => state.setFocusedIndex);
  const isEditMode = useBookmarkStore((state) => state.isEditMode);
  const setSelectedBookmark = useBookmarkStore(
    (state) => state.setSelectedBookmark
  );

  const listRef = useRef<HTMLDivElement>(null);

  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);

  const { data: bookmarks, isPending } = api.bookmark.getAllByGroup.useQuery(
    {
      groupId: selectedGroup.id
    },
    {
      placeholderData: keepPreviousData
    }
  );

  const toggleDeleteBookmarkDialog = () => {
    setIsDeleteBookmarkDialogOpen((prev) => !prev);
  };

  const focusList = useCallback(() => {
    listRef.current?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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

  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!ShortcutManager.isFocusListShortcut(event) || isEditMode) return;

      event.preventDefault();
      event.stopPropagation();

      focusList();
    },
    [focusList, isEditMode]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

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

    const filteredBookmarks = bookmarks.filter((bookmark) => {
      if (filter === '') return true;

      if (bookmark.type === 'text') {
        return bookmark.content.toLowerCase().includes(filter.toLowerCase());
      }

      return (
        bookmark.content.toLowerCase().includes(filter.toLowerCase()) ||
        bookmark.title?.toLowerCase().includes(filter.toLowerCase())
      );
    });

    const noMatches = 'No bookmarks matches your search.';

    if (filteredBookmarks.length === 0 && filter !== '') {
      return (
        <div className="flex h-full items-center justify-center py-4">
          <p className="text-muted-foreground text-xs">{noMatches}</p>
        </div>
      );
    }

    return filteredBookmarks.map((item, index) => (
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
      ref={listRef}
      tabIndex={0}
      data-slot="bookmark-list"
      className={cn('group/list focus-visible:outline-none', className)}
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
