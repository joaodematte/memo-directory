import { toast } from 'sonner';

import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';

export function useUpdateBookmarkMutation() {
  const trpcUtils = api.useUtils();

  const { selectedGroup } = useGroup();
  const { setIsEditMode } = useBookmark();

  return api.bookmark.update.useMutation({
    onMutate: async (data) => {
      const previousBookmarks = trpcUtils.bookmark.getAllByGroup.getData({
        groupId: selectedGroup.id
      });

      if (!previousBookmarks) {
        console.warn('No bookmarks cache found. Optimistic update skypped.');
        return { previousBookmarks };
      }

      await trpcUtils.bookmark.getAllByGroup.cancel({
        groupId: selectedGroup.id
      });

      const bookmarkToUpdate = previousBookmarks.find((b) => b.id === data.id);

      if (!bookmarkToUpdate) {
        console.warn(
          'No target bookmark data found in cache. Optimistic delete skipped.'
        );

        return { previousBookmarks };
      }

      const updatedBookmark = {
        ...bookmarkToUpdate,
        id: data.id,
        groupId: data.groupId,
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content })
      };

      trpcUtils.bookmark.getAllByGroup.setData(
        { groupId: selectedGroup.id },
        previousBookmarks.map((bk) => {
          if (bk.id === updatedBookmark.id) return updatedBookmark;

          return bk;
        })
      );

      setIsEditMode(false);
      toast.success('Bookmark updated');

      return { previousBookmarks };
    },
    onError: (err, _newBookmarkData, context) => {
      console.error(
        'Bookmark update failed, reverting optimistic changes:',
        err
      );

      if (context?.previousBookmarks) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: selectedGroup.id },
          context.previousBookmarks
        );
      }
    },
    onSettled: async (_data, _error, variables) => {
      await trpcUtils.bookmark.getAllByGroup.invalidate({
        groupId: selectedGroup.id
      });

      if (variables.groupId !== selectedGroup.id) {
        await trpcUtils.bookmark.getAllByGroup.invalidate({
          groupId: variables.groupId
        });
      }
    }
  });
}
