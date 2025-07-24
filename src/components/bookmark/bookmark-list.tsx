import { useState } from 'react';

import { BookmarkItem } from '@/components/bookmark/bookmark-item';
import { DeleteBookmarkDialog } from '@/components/bookmark/delete-bookmark-dialog';
import { CommandEmpty, CommandGroup, CommandList } from '@/components/cmdk';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Bookmark } from '@/types';

interface BookmarkListProps extends React.ComponentProps<typeof CommandList> {
  bookmarks?: Bookmark[];
}

export function BookmarkList({ bookmarks, ...props }: BookmarkListProps) {
  const [isDeleteBookmarkDialogOpen, setIsDeleteBookmarkDialogOpen] =
    useState<boolean>(false);

  const toggleDeleteBookmarkDialog = () => {
    setIsDeleteBookmarkDialogOpen(true);
  };

  return (
    <CommandList {...props}>
      <ScrollArea className="h-[480px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {bookmarks?.map((item) => (
            <BookmarkItem
              key={item.id}
              toggleDeleteDialog={toggleDeleteBookmarkDialog}
              {...item}
            />
          ))}
        </CommandGroup>
      </ScrollArea>

      <DeleteBookmarkDialog
        open={isDeleteBookmarkDialogOpen}
        onOpenChange={setIsDeleteBookmarkDialogOpen}
        toggleDialog={toggleDeleteBookmarkDialog}
      />
    </CommandList>
  );
}
