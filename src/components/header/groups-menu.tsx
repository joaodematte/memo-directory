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
import { Kbd } from '@/components/ui/kbd';
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger
} from '@/components/ui/menu';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

type GroupsMenuProps = Omit<React.ComponentProps<typeof Menu>, 'children'>;

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
    <Menu {...props}>
      <MenuTrigger
        render={(props) => (
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
        )}
      />
      <MenuContent align="start">
        <MenuGroup>
          <MenuLabel>Groups</MenuLabel>
          <MenuRadioGroup
            value={selectedGroup.id}
            onValueChange={onGroupValueChange}
          >
            {groups.map(({ id, name, color }, index) => (
              <MenuRadioItem
                key={id}
                value={id}
                shouldRenderIndicator={false}
                closeOnClick
                className="group"
                onMouseEnter={() => onMouseEnter(id)}
              >
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                <MenuShortcut>
                  <Kbd className="group-data-checked:hidden">{index + 1}</Kbd>
                  <CheckIcon
                    className="not-group-data-checked:hidden"
                    strokeWidth={2.5}
                  />
                </MenuShortcut>
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuLabel>Actions</MenuLabel>
          <MenuItem onClick={toggleCreateDialog}>
            <CirclePlusIcon strokeWidth={2.5} />
            <span>Create Group</span>
            <MenuShortcut>
              <Kbd>C</Kbd>
            </MenuShortcut>
          </MenuItem>
          <MenuItem onClick={toggleDeleteDialog}>
            <TrashIcon strokeWidth={2.5} />
            <span>Delete Group</span>
            <MenuShortcut>
              <Kbd>D</Kbd>
            </MenuShortcut>
          </MenuItem>
        </MenuGroup>
      </MenuContent>

      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        toggleDialog={toggleCreateDialog}
      />
      <DeleteGroupDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        toggleDialog={toggleDeleteDialog}
      />
    </Menu>
  );
}
