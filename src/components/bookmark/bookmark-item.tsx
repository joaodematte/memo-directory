'use client';

import { BookmarkItemContent } from '@/components/bookmark/bookmark-item-content';
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
import { useBookmarkStore } from '@/stores/bookmark-store';
import type { Bookmark } from '@/types';

interface BookmarkItemProps extends React.ComponentProps<'div'> {
  index: number;
  bookmark: Bookmark;
  onDeleteBookmark: () => void;
  updateActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function BookmarkItem({
  index,
  bookmark,
  onDeleteBookmark,
  updateActiveIndex,
  ...props
}: BookmarkItemProps) {
  const setSelectedBookmark = useBookmarkStore(
    (state) => state.setSelectedBookmark
  );

  const selectBookmark = () => {
    setSelectedBookmark(bookmark);
    updateActiveIndex(index);
  };

  const onContextMenuOpen = (open: boolean) => {
    if (open) selectBookmark();
  };

  return (
    <ContextMenu onOpenChange={onContextMenuOpen}>
      <ContextMenuTrigger asChild>
        <BookmarkItemContent bookmark={bookmark} {...props} />
      </ContextMenuTrigger>
      <ContextMenuContent data-slot="bookmark-item-context-menu">
        <ContextMenuItem>
          Copy content
          <ContextMenuShortcut>
            <Kbd keys={['C']} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
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
