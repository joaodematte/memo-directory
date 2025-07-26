import {
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import { useUpdateBookmark } from '@/hooks/use-update-bookmark';
import { useGroupStore } from '@/providers/group-store-provider';
import { useBookmarkStore } from '@/stores/bookmark-store';
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
  const selectedBookmark = useBookmarkStore((state) => state.selectedBookmark);

  const { mutateAsync: updateBookmark } = useUpdateBookmark();

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
