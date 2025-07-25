'use client';

import {
  CheckIcon,
  ChevronsUpDownIcon,
  CirclePlusIcon,
  TrashIcon
} from 'lucide-react';
import { useState } from 'react';

import { CreateGroupDialog } from '@/components/header/create-group-dialog';
import { DeleteGroupDialog } from '@/components/header/delete-group-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

type GroupsMenuProps = Omit<
  React.ComponentProps<typeof DropdownMenu>,
  'children'
>;

export function GroupsMenu(props: GroupsMenuProps) {
  const trpcUtils = api.useUtils();

  const { groups, selectedGroup, setSelectedGroup } = useGroup();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const onGroupValueChange = (val: string) => {
    const targetGroup = groups.find((gp) => gp.id === val);

    if (targetGroup) setSelectedGroup(targetGroup);
  };

  const toggleCreateDialog = () => {
    setIsCreateDialogOpen(!isCreateDialogOpen);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const onMouseEnter = (id: string) => {
    void trpcUtils.bookmark.getAllByGroup.prefetch({ groupId: id });
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" {...props}>
          <div
            className="size-2 rounded-full"
            style={{
              backgroundColor: selectedGroup.color
            }}
          />
          <span className="ml-1">{selectedGroup.name}</span>
          <ChevronsUpDownIcon
            className="text-muted-foreground size-3"
            strokeWidth={2.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Groups</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedGroup.id}
            onValueChange={onGroupValueChange}
          >
            {groups.map(({ id, name, color }, index) => (
              <DropdownMenuRadioItem
                key={id}
                value={id}
                shouldRenderIndicator={false}
                className="group"
                onMouseEnter={() => onMouseEnter(id)}
              >
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                <DropdownMenuShortcut>
                  <Kbd className="group-data-[state=checked]:hidden">
                    {index + 1}
                  </Kbd>
                  <CheckIcon
                    className="not-group-data-[state=checked]:hidden"
                    strokeWidth={2.5}
                  />
                </DropdownMenuShortcut>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={toggleCreateDialog}>
            <CirclePlusIcon strokeWidth={2.5} />
            <span>Create Group</span>
            <DropdownMenuShortcut>
              <Kbd>C</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleDeleteDialog}>
            <TrashIcon strokeWidth={2.5} />
            <span>Delete Group</span>
            <DropdownMenuShortcut>
              <Kbd>D</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        toggleDialog={toggleCreateDialog}
      />
      <DeleteGroupDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </DropdownMenu>
  );
}
