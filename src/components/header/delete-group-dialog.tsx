import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

interface DeleteGroupDialogProps
  extends React.ComponentProps<typeof AlertDialog> {
  toggleDialog: () => void;
}

export function DeleteGroupDialog({
  toggleDialog,
  ...props
}: DeleteGroupDialogProps) {
  const trpcUtils = api.useUtils();

  const { groups, selectedGroup, setSelectedGroup } = useGroup();

  const { mutateAsync: deleteGroup, isPending } = api.group.delete.useMutation({
    onMutate: async (data) => {
      await trpcUtils.group.getAllByUser.cancel();

      const previousGroups = trpcUtils.group.getAllByUser.getData();

      if (!previousGroups) return;

      const updatedGroups = previousGroups.filter((gp) => gp.id !== data.id);

      trpcUtils.group.getAllByUser.setData(undefined, updatedGroups);

      setSelectedGroup(groups[0]!);
      toggleDialog();

      toast.success('Group deleted');
    },
    onSettled: async () => {
      await trpcUtils.group.getAllByUser.invalidate();
    }
  });

  const handleDelete = async () => {
    await deleteGroup({ id: selectedGroup.id });
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your group will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={(props) => (
              <Button {...props} size="sm" variant="ghost" disabled={isPending}>
                Cancel
              </Button>
            )}
          />

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
