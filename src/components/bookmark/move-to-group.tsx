import { toast } from 'sonner';

import {
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import { useGroupStore } from '@/providers/group-store-provider';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { api } from '@/trpc/react';
import type { Group } from '@/types';

interface ContextMenuGroupItemProps extends Group {
  index: number;
}

function ContextMenuGroupItem({
  id,
  name,
  color,
  index
}: ContextMenuGroupItemProps) {
  const trpcUtils = api.useUtils();

  const selectedBookmark = useBookmarkStore((state) => state.selectedBookmark);

  const { mutateAsync: updateBookmark } = api.bookmark.update.useMutation({
    onMutate: async () => {
      if (!selectedBookmark) return;

      const previousBookmarks = trpcUtils.bookmark.getAllByGroup.getData({
        groupId: selectedBookmark.groupId
      });

      if (!previousBookmarks) {
        console.warn('No bookmarks cache found. Optimistic update skypped.');
        return { previousBookmarks };
      }

      await trpcUtils.bookmark.getAllByGroup.cancel({
        groupId: selectedBookmark.groupId
      });

      const updatedBookmarks = previousBookmarks.filter(
        (bk) => bk.id !== selectedBookmark.id
      );

      trpcUtils.bookmark.getAllByGroup.setData(
        { groupId: selectedBookmark.groupId },
        updatedBookmarks
      );

      toast.success('Bookmark updated');

      return { previousBookmarks };
    },
    onSettled: async (data) => {
      if (!selectedBookmark || !data) return;

      await trpcUtils.bookmark.getAllByGroup.invalidate({
        groupId: selectedBookmark.groupId
      });

      await trpcUtils.bookmark.getAllByGroup.invalidate({
        groupId: data.groupId
      });
    }
  });

  const handleMoveToTab = async () => {
    if (!selectedBookmark) return;

    await updateBookmark({
      id: selectedBookmark.id,
      groupId: id
    });
  };

  return (
    <ContextMenuItem key={id} onClick={handleMoveToTab}>
      <div className="size-4 rounded-full" style={{ backgroundColor: color }} />
      {name}
      <ContextMenuShortcut>
        <Kbd keys={[String(index + 1)]} />
      </ContextMenuShortcut>
    </ContextMenuItem>
  );
}

export function MoveToGroupSub(
  props: React.ComponentProps<typeof ContextMenuSub>
) {
  const groups = useGroupStore((state) => state.groups);
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  const filteredGroups = groups.filter((gp) => gp.id !== selectedGroup.id);

  if (filteredGroups.length === 0) return null;

  return (
    <ContextMenuSub {...props}>
      <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {filteredGroups.map((group, index) => (
          <ContextMenuGroupItem key={group.id} index={index} {...group} />
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
