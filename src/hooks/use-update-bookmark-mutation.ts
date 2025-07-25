import { useBookmark } from '@/contexts/bookmark-context';
import { useGroup } from '@/contexts/group-context';
import { api } from '@/trpc/react';
import type { Bookmark } from '@/types';

export function useUpdateBookmarkMutation() {
  const trpcUtils = api.useUtils();

  const { selectedGroup } = useGroup();
  const { setIsEditMode } = useBookmark();

  return api.bookmark.update.useMutation({
    onMutate: async (data) => {
      const previousSelectedGroupBookmarks =
        trpcUtils.bookmark.getAllByGroup.getData({
          groupId: selectedGroup.id
        });

      const isGroupChanging = data.groupId !== selectedGroup.id;

      let previousTargetGroupBookmarks: Bookmark[] | undefined;
      if (isGroupChanging) {
        previousTargetGroupBookmarks = trpcUtils.bookmark.getAllByGroup.getData(
          {
            groupId: data.groupId
          }
        );
      }

      const promises = [
        trpcUtils.bookmark.getAllByGroup.cancel({ groupId: selectedGroup.id })
      ];

      if (isGroupChanging) {
        promises.push(
          trpcUtils.bookmark.getAllByGroup.cancel({ groupId: data.groupId })
        );
      }

      await Promise.all(promises);

      const bookmarkToUpdate = previousSelectedGroupBookmarks?.find(
        (b) => b.id === data.id
      );

      if (!bookmarkToUpdate) {
        console.warn(
          'No target bookmark data found in cache. Optimistic delete skipped.'
        );

        return { previousSelectedGroupBookmarks, previousTargetGroupBookmarks };
      }

      trpcUtils.bookmark.getAllByGroup.setData(
        { groupId: selectedGroup.id },
        (oldCacheData) => {
          return oldCacheData?.filter((b) => b.id !== data.id) ?? [];
        }
      );

      const updatedBookmark = {
        ...bookmarkToUpdate,
        id: data.id,
        groupId: data.groupId,
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content })
      };

      if (isGroupChanging) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: data.groupId },
          (oldTargetCacheData) => {
            return oldTargetCacheData
              ? [...oldTargetCacheData, updatedBookmark]
              : [updatedBookmark];
          }
        );
      } else {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: selectedGroup.id },
          (oldCacheData) =>
            oldCacheData?.map((b) => {
              if (b.id === data.id) {
                return {
                  ...b,
                  ...(data.title !== undefined && { title: data.title }),
                  ...(data.content !== undefined && { content: data.content })
                };
              }
              return b;
            }) ?? []
        );
      }

      setIsEditMode(false);

      return { previousSelectedGroupBookmarks, previousTargetGroupBookmarks };
    },
    onError: (err, newBookmarkData, context) => {
      console.error(
        'Bookmark update failed, reverting optimistic changes:',
        err
      );

      if (context?.previousSelectedGroupBookmarks) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: selectedGroup.id },
          context.previousSelectedGroupBookmarks
        );
      }

      if (
        newBookmarkData.groupId !== selectedGroup.id &&
        context?.previousTargetGroupBookmarks !== undefined
      ) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: newBookmarkData.groupId },
          context.previousTargetGroupBookmarks
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
