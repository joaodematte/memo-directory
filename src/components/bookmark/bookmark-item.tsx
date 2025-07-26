'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BookmarkText } from '@/components/bookmark/bookmark-text';
import { BookmarkUrl } from '@/components/bookmark/bookmark-url';
import { MoveToGroupSub } from '@/components/bookmark/move-to-group';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import {
  useUpdateBookmark,
  type UpdateBookmarkData
} from '@/hooks/use-update-bookmark';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { ShortcutManager } from '@/lib/shortcut-manager';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useFocusStore } from '@/stores/focus-store';
import type { Bookmark } from '@/types';

interface BookmarkItemProps extends React.ComponentProps<'div'> {
  index: number;
  bookmark: Bookmark;
  focusList: () => void;
  onDeleteBookmark: () => void;
}

export function BookmarkItem({
  index,
  bookmark,
  focusList,
  onDeleteBookmark,
  ...props
}: BookmarkItemProps) {
  const focusedIndex = useFocusStore((state) => state.focusedIndex);
  const setSelectedBookmark = useBookmarkStore(
    (state) => state.setSelectedBookmark
  );
  const setIsEditMode = useBookmarkStore((state) => state.setIsEditMode);
  const setFocusedIndex = useFocusStore((state) => state.setFocusedIndex);

  const [inputValue, setInputValue] = useState<string>(
    bookmark.type === 'text' ? bookmark.content : (bookmark.title ?? '')
  );
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const lastInputValueRef = useRef<string>(inputValue);
  const editInputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEditing =
    useBookmarkStore((state) => state.isEditMode) && focusedIndex === index;

  const { mutateAsync: updateBookmark } = useUpdateBookmark({
    onMutate: () => {
      focusList();
    }
  });

  const selectBookmark = () => {
    setSelectedBookmark(bookmark);
    setFocusedIndex(index);
  };

  const handleUpdateBookmark = useCallback(async () => {
    let dataToMutate: UpdateBookmarkData;

    if (bookmark.type === 'text') {
      dataToMutate = {
        id: bookmark.id,
        groupId: bookmark.groupId,
        content: inputValue
      };
    } else {
      dataToMutate = {
        id: bookmark.id,
        groupId: bookmark.groupId,
        title: inputValue
      };
    }

    await updateBookmark(dataToMutate);
  }, [
    bookmark.id,
    bookmark.groupId,
    bookmark.type,
    inputValue,
    updateBookmark
  ]);

  const onContextMenuOpen = (open: boolean) => {
    if (open) selectBookmark();
  };

  const handleOnInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleOnCopy = useCallback(async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(bookmark.content);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopying(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsCopying(false);
    }
  }, [bookmark.content]);

  const handleOnEdit = useCallback(() => {
    setIsEditMode(true);

    setTimeout(() => {
      editInputRef.current?.select();
    }, 0);
  }, [setIsEditMode]);

  const clearEditMode = useCallback(() => {
    setIsEditMode(false);
    setInputValue(lastInputValueRef.current);
  }, [setIsEditMode]);

  const handleOnKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      const isFocused = focusedIndex === index;

      if (!isFocused) return;

      if (ShortcutManager.isCopyShortcut(event)) {
        event.preventDefault();

        return await handleOnCopy();
      }

      if (
        ShortcutManager.isOpenInNewTabShortcut(event) &&
        bookmark.type === 'url' &&
        !isEditing
      ) {
        event.preventDefault();

        return window.open(bookmark.content, '_blank');
      }

      if (ShortcutManager.isEditShortcut(event)) {
        event.preventDefault();

        return handleOnEdit();
      }

      if (KeyboardManager.isEscapeKey(event)) {
        event.preventDefault();

        clearEditMode();

        return focusList();
      }

      if (ShortcutManager.isDeleteShortcut(event)) {
        event.preventDefault();

        return onDeleteBookmark();
      }

      if (KeyboardManager.isEnterKey(event) && isEditing) {
        event.preventDefault();

        return handleUpdateBookmark();
      }
    },
    [
      focusedIndex,
      index,
      bookmark.type,
      bookmark.content,
      isEditing,
      handleOnCopy,
      handleOnEdit,
      clearEditMode,
      focusList,
      handleUpdateBookmark
    ]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    document.addEventListener('keydown', handleOnKeyDown);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      document.removeEventListener('keydown', handleOnKeyDown);
    };
  }, [handleOnKeyDown]);

  return (
    <ContextMenu modal={false} onOpenChange={onContextMenuOpen}>
      <ContextMenuTrigger asChild>
        {bookmark.type === 'text' ? (
          <BookmarkText
            editInputRef={editInputRef}
            inputValue={inputValue}
            onEditInputChange={handleOnInputChange}
            bookmark={bookmark}
            isCopying={isCopying}
            isEditing={isEditing}
            {...props}
          />
        ) : (
          <BookmarkUrl
            editInputRef={editInputRef}
            inputValue={inputValue}
            onEditInputChange={handleOnInputChange}
            bookmark={bookmark}
            isCopying={isCopying}
            isEditing={isEditing}
            {...props}
          />
        )}
      </ContextMenuTrigger>
      <ContextMenuContent data-slot="bookmark-item-context-menu">
        <ContextMenuItem onClick={handleOnCopy}>
          Copy content
          <ContextMenuShortcut>
            <Kbd keys={['C']} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleOnEdit}>
          Edit
          <ContextMenuShortcut>
            <Kbd keys={['E']} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteBookmark}>
          Delete
          <ContextMenuShortcut>
            <Kbd keys={['D']} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <MoveToGroupSub />
      </ContextMenuContent>
    </ContextMenu>
  );
}
