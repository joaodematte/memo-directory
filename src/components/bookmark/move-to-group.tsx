import {
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { useUpdateBookmarkMutation } from '@/hooks/use-update-bookmark-mutation';
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
  const { selectedBookmark } = useBookmark();

  const { mutateAsync: updateBookmark } = useUpdateBookmarkMutation();

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
        <Kbd>{index + 1}</Kbd>
      </ContextMenuShortcut>
    </ContextMenuItem>
  );
}

export function MoveToGroupSub() {
  const { groups, selectedGroup } = useGroup();

  const filteredGroups = groups.filter((gp) => gp.id !== selectedGroup.id);

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {filteredGroups.map((group, index) => (
          <ContextMenuGroupItem key={group.id} index={index} {...group} />
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
