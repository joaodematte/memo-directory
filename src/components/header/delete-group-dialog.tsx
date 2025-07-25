import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useGroupStore } from '@/providers/group-store-provider';
import { api } from '@/trpc/react';

export function DeleteGroupDialog(
  props: React.ComponentProps<typeof AlertDialog>
) {
  const trpcUtils = api.useUtils();

  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);

  const { mutateAsync: deleteGroup, isPending } = api.group.delete.useMutation({
    onMutate: async (data) => {
      await trpcUtils.group.getAllByUser.cancel();

      const previousGroups = trpcUtils.group.getAllByUser.getData();

      if (!previousGroups) {
        console.warn(
          'No previous group data found in cache. Optimistic delete skipped.'
        );

        return { previousGroups };
      }

      const groupIndex = previousGroups.findIndex((gp) => gp.id === data.id);
      const updatedGroups = previousGroups.filter((gp) => gp.id !== data.id);
      const indexToSelect = groupIndex === 0 ? 0 : groupIndex - 1;

      trpcUtils.group.getAllByUser.setData(undefined, updatedGroups);

      setSelectedGroup(updatedGroups[indexToSelect]!);

      toast.success('Group deleted');

      return { previousGroups };
    },
    onError: (err, variables, context) => {
      console.error(
        `Group deletion failed for ID: ${variables.id}. Reverting optimistic changes.`,
        err
      );

      if (context?.previousGroups) {
        trpcUtils.group.getAllByUser.setData(undefined, context.previousGroups);
      }

      toast.error(`Failed to delete group: ${err.message || 'Unknown error'}`);
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
