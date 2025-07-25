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
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

export function DeleteBookmarkDialog(
  props: React.ComponentProps<typeof AlertDialog>
) {
  const trpcUtils = api.useUtils();

  const { selectedGroup } = useGroup();
  const { selectedBookmark } = useBookmark();

  const { mutateAsync: deleteBookmark, isPending } =
    api.bookmark.delete.useMutation({
      onMutate: async (data) => {
        await trpcUtils.bookmark.getAllByGroup.cancel({
          groupId: selectedGroup.id
        });

        const previousBookmarks = trpcUtils.bookmark.getAllByGroup.getData({
          groupId: selectedGroup.id
        });

        if (!previousBookmarks) {
          console.warn(
            'No previous bookmark data found in cache. Optimistic delete skipped.'
          );

          return { previousBookmarks };
        }

        const updatedBookmarks = previousBookmarks.filter(
          (bk) => bk.id !== data.id
        );

        trpcUtils.bookmark.getAllByGroup.setData(
          {
            groupId: selectedGroup.id
          },
          updatedBookmarks
        );

        toast.success('Bookmark deleted');

        return { previousBookmarks };
      },
      onError: (err, variables, context) => {
        console.error(
          `Bookmark deletion failed for ID: ${variables.id}. Reverting optimistic changes.`,
          err
        );

        if (context?.previousBookmarks) {
          trpcUtils.bookmark.getAllByGroup.setData(
            { groupId: selectedGroup.id },
            context.previousBookmarks
          );
        }

        toast.error(
          `Failed to delete bookmark: ${err.message || 'Unknown error'}`
        );
      },
      onSettled: async () => {
        await trpcUtils.group.getAllByUser.invalidate();
      }
    });

  const handleDelete = async () => {
    if (!selectedBookmark) return;

    await deleteBookmark({ id: selectedBookmark.id });
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
