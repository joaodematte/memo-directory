'use client';

import { useRef } from 'react';
import { toast } from 'sonner';

import { BookmarkItemText } from '@/components/bookmark/bookmark-item-text';
import { BookmarkItemUrl } from '@/components/bookmark/bookmark-item-url';
import { MoveToGroupSub } from '@/components/bookmark/move-to-group';
import { CommandItem } from '@/components/cmdk';
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
  toggleDeleteDialog: () => void;
}

export function BookmarkItem({
  toggleDeleteDialog,
  ...props
}: BookmarkItemProps) {
  const { selectedBookmark, isEditMode, setIsEditMode, setSelectedBookmark } =
    useBookmark();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.content);

      toast.success('Content copied');
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

  const Content = props.type === 'url' ? BookmarkItemUrl : BookmarkItemText;

  return (
    <ContextMenu modal={false} onOpenChange={onContextMenuOpenChange}>
      <ContextMenuTrigger asChild>
        <CommandItem
          className={cn(
            isEditMode && selectedBookmark?.id !== props.id && 'blur-xs'
          )}
        >
          <Content inputRef={inputRef} {...props} />
        </CommandItem>
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
