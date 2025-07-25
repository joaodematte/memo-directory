import { CheckIcon } from 'lucide-react';

import {
  DropdownMenuRadioItem,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { api } from '@/trpc/react';
import type { Group } from '@/types';

interface GroupRadioItemProps
  extends React.ComponentProps<typeof DropdownMenuRadioItem> {
  group: Group;
  index: number;
}

export function GroupRadioItem({
  group,
  index,
  ...props
}: GroupRadioItemProps) {
  const trpcUtils = api.useUtils();

  const onMouseEnter = () => {
    void trpcUtils.bookmark.getAllByGroup.prefetch({ groupId: group.id });
  };

  return (
    <DropdownMenuRadioItem
      shouldRenderIndicator={false}
      className="group"
      onMouseEnter={onMouseEnter}
      {...props}
    >
      <div
        className="size-4 rounded-full"
        style={{ backgroundColor: group.color }}
      />
      <span>{group.name}</span>
      <DropdownMenuShortcut>
        <Kbd
          keys={[String(index + 1)]}
          className="group-data-[state=checked]:hidden"
        />
        <CheckIcon
          className="not-group-data-[state=checked]:hidden"
          strokeWidth={2.5}
        />
      </DropdownMenuShortcut>
    </DropdownMenuRadioItem>
  );
}
