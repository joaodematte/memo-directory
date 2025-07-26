import { keepPreviousData } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { useGroupStore } from '@/providers/group-store-provider';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useFocusStore } from '@/stores/focus-store';
import { api } from '@/trpc/react';

import { BookmarkItem } from './bookmark-item';

interface BookmarkListProps {
  filter: string;
}

type BookmarkItemRef = {
  id: string;
  ref: HTMLButtonElement;
};

export function BookmarkList({ filter }: BookmarkListProps) {
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const focusedIndex = useFocusStore((state) => state.focusedIndex);
  const setFocusedIndex = useFocusStore((state) => state.setFocusedIndex);
  const isEditMode = useBookmarkStore((state) => state.isEditMode);

  const elementsRef = useRef<BookmarkItemRef[]>([]);

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

  const focusElement = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      if (index !== -1) elementsRef.current[index]?.ref.focus();
    },
    [setFocusedIndex]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (KeyboardManager.isArrowKey(event) && !isEditMode) {
      event.preventDefault();

      if (KeyboardManager.isArrowDownKey(event)) {
        const nextIndex = (focusedIndex + 1) % (bookmarks?.length ?? 0);
        focusElement(nextIndex);
      }

      if (KeyboardManager.isArrowUpKey(event)) {
        const nextIndex =
          (focusedIndex - 1 + (bookmarks?.length ?? 0)) %
          (bookmarks?.length ?? 0);
        focusElement(nextIndex);
      }
    }
  };

  const handleGlobalKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (ShortcutManager.isFocusListShortcut(event) && !isEditMode) {
        event.preventDefault();

        focusElement(0);
      }
    },
    [isEditMode, focusElement]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.removeEventListener('keydown', handleGlobalKeyDown);
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
        ref={(el) => {
          if (el) {
            elementsRef.current[index] = {
              id: item.id,
              ref: el
            };
          }
        }}
        index={index}
        bookmark={item}
        onDeleteBookmark={toggleDeleteBookmarkDialog}
        focusElement={focusElement}
        onKeyDown={handleKeyDown}
      />
    ));
  };

  return (
    <>
      {renderContent()}

      <DeleteBookmarkDialog
        open={isDeleteBookmarkDialogOpen}
        onOpenChange={setIsDeleteBookmarkDialogOpen}
      />
    </>
  );
}
