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
import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

interface DeleteBookmarkDialogProps
  extends React.ComponentProps<typeof AlertDialog> {
  toggleDialog: () => void;
}

export function DeleteBookmarkDialog({
  toggleDialog,
  ...props
}: DeleteBookmarkDialogProps) {
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

        if (!previousBookmarks) return;

        const updatedBookmarks = previousBookmarks.filter(
          (bk) => bk.id !== data.id
        );

        trpcUtils.bookmark.getAllByGroup.setData(
          {
            groupId: selectedGroup.id
          },
          updatedBookmarks
        );

        toggleDialog();

        toast.success('Bookmark deleted');
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
