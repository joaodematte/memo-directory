'use client';

import React, { useRef, useState } from 'react';

import { BookmarkItemText } from '@/components/bookmark/bookmark-item-text';
import { BookmarkItemUrl } from '@/components/bookmark/bookmark-item-url';
import { MoveToGroupSub } from '@/components/bookmark/move-to-group';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

interface BookmarkItemProps extends Bookmark {
  index: number;
  ref: (el: HTMLButtonElement) => void;
  toggleDeleteDialog: () => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function BookmarkItem({
  index,
  ref,
  toggleDeleteDialog,
  setActiveIndex,
  ...props
}: BookmarkItemProps) {
  const { selectedBookmark, isEditMode, setIsEditMode, setSelectedBookmark } =
    useBookmark();

  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.content);

      setHasCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setHasCopied(false);
        copyTimeoutRef.current = null;
      }, 3000);
    } catch {
      console.error('Unable to write to clipboard');
    }
  };

  const handleDelete = () => {
    toggleDeleteDialog();
  };

  const onContextMenuOpenChange = (open: boolean) => {
    if (open) setSelectedBookmark({ ...props });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);

    if (!isEditMode) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleFocus = () => {
    setActiveIndex(index);
  };

  const isEditing = isEditMode && selectedBookmark?.id === props.id;
  const Content = props.type === 'url' ? BookmarkItemUrl : BookmarkItemText;

  return (
    <ContextMenu modal={false} onOpenChange={onContextMenuOpenChange}>
      <ContextMenuTrigger asChild>
        <Content
          ref={ref}
          id={props.id}
          className={cn(
            'group flex w-full items-center gap-4 rounded-md px-4 py-2',
            'hover:bg-accent',
            'focus-visible:bg-accent focus-visible:outline-none',
            'data-[state=open]:bg-accent',
            isEditing && 'bg-accent'
          )}
          inputRef={inputRef}
          hasCopied={hasCopied}
          bookmark={{ ...props }}
          onFocus={handleFocus}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={handleCopy}>
            Copy
            <ContextMenuShortcut>
              <Kbd>C</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={toggleEditMode}>
            Edit
            <ContextMenuShortcut>
              <Kbd>E</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>
            Delete
            <ContextMenuShortcut>
              <Kbd>D</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <MoveToGroupSub />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
