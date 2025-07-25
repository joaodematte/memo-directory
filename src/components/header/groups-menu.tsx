'use client';

import { ChevronsUpDownIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { CreateGroupDialog } from '@/components/header/create-group-dialog';
import { DeleteGroupDialog } from '@/components/header/delete-group-dialog';
import { GroupRadioItem } from '@/components/header/group-radio-item';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { KeyboardManager } from '@/lib/keyboard-manager';
import { useGroupStore } from '@/providers/group-store-provider';

type GroupsMenuProps = Omit<
  React.ComponentProps<typeof DropdownMenu>,
  'children'
>;

export function GroupsMenu(props: GroupsMenuProps) {
  const groups = useGroupStore((state) => state.groups);
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (KeyboardManager.isKey(event, 'c') && !isCreateDialogOpen) {
      event.preventDefault();

      toggleCreateDialog();
      setIsMenuOpen(false);
      return;
    }

    if (KeyboardManager.isKey(event, 'd') && !isDeleteDialogOpen) {
      event.preventDefault();

      toggleDeleteDialog();
      setIsMenuOpen(false);
      return;
    }

    if (KeyboardManager.isNumberKey(event)) {
      event.preventDefault();

      const group = groups.find((_gp, i) => String(i + 1) === event.key);

      if (group && group.id !== selectedGroup.id) {
        setSelectedGroup(group);
        setIsMenuOpen(false);
        return;
      }
    }
  };

  const disableDelete = groups.length <= 1;

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" {...props}>
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
      <DropdownMenuContent align="start" onKeyDown={handleKeyDown}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Groups</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedGroup.id}
            onValueChange={onGroupValueChange}
          >
            {groups.map((group, index) => (
              <GroupRadioItem
                key={group.id}
                value={group.id}
                group={group}
                index={index}
              />
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={toggleCreateDialog}>
            <PlusIcon strokeWidth={2.5} />
            <span>Create Group</span>
            <DropdownMenuShortcut>
              <Kbd keys={['C']} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleDeleteDialog}
            disabled={disableDelete}
          >
            <TrashIcon strokeWidth={2.5} />
            <span>Delete Group</span>
            <DropdownMenuShortcut>
              <Kbd keys={['D']} />
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
