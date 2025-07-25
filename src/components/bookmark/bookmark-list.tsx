import { useEffect, useRef, useState } from 'react';

import { BookmarkItem } from '@/components/bookmark/bookmark-item';
import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { api } from '@/trpc/react';

export function BookmarkList() {
  const { selectedGroup } = useGroup();
  const { isEditMode, setSelectedBookmark } = useBookmark();

  const bookmarksRef = useRef<HTMLButtonElement[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { data: bookmarks, isLoading } = api.bookmark.getAllByGroup.useQuery({
    groupId: selectedGroup.id
  });

  const toggleDeleteBookmarkDialog = () => {
    setIsDeleteBookmarkDialogOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!bookmarks || isEditMode) return;

    if (KeyboardManager.isArrowDownKey(event)) {
      event.preventDefault();

      setActiveIndex((prevIndex) => (prevIndex + 1) % bookmarks.length);
    } else if (KeyboardManager.isArrowUpKey(event)) {
      event.preventDefault();

      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + bookmarks.length) % bookmarks.length
      );
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!listRef.current?.contains(event.relatedTarget)) {
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (
      activeIndex !== -1 &&
      bookmarksRef.current[activeIndex] &&
      !isEditMode
    ) {
      const element = bookmarksRef.current[activeIndex];
      const bookmark = bookmarks?.find((bk) => bk.id === element.id);

      if (!bookmark) return;

      element.focus();
      setSelectedBookmark(bookmark);
    }
  }, [activeIndex, bookmarks, isEditMode, setSelectedBookmark]);

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!ShortcutManager.isFocusInputShortcut(event)) return;
    event.preventDefault();

    setActiveIndex(0);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  const content = isLoading
    ? Array.from({ length: 12 }).map((_, i) => <BookmarkSkeleton key={i} />)
    : bookmarks?.map((item, index) => (
        <BookmarkItem
          key={item.id}
          ref={(el) => (bookmarksRef.current[index] = el)}
          index={index}
          toggleDeleteDialog={toggleDeleteBookmarkDialog}
          setActiveIndex={setActiveIndex}
          {...item}
        />
      ));

  return (
    <ScrollArea
      ref={listRef}
      className="flex h-[436px]"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {content}

      <DeleteBookmarkDialog
        open={isDeleteBookmarkDialogOpen}
        onOpenChange={setIsDeleteBookmarkDialogOpen}
      />
    </ScrollArea>
  );
}
