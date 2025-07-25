import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';

import { authClient } from '@/lib/auth-client';
import { useGroupStore } from '@/providers/group-store-provider';
import { api } from '@/trpc/react';

type MutationCallback = () => void;

export function useCreateBookmark(mutationCallback?: MutationCallback) {
  const trpcUtils = api.useUtils();

  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  const { data: sessionData } = authClient.useSession();

  return api.bookmark.create.useMutation({
    onMutate: async (data) => {
      await trpcUtils.bookmark.getAllByGroup.cancel({
        groupId: selectedGroup.id
      });

      const previousBookmarks = trpcUtils.bookmark.getAllByGroup.getData({
        groupId: selectedGroup.id
      });

      if (!previousBookmarks || !sessionData) {
        console.warn(
          'No previous bookmark data or session data found in cache. Optimistic create skipped.'
        );

        return { previousBookmarks };
      }

      const newBookmark = {
        id: uuidv7(),
        type: data.type,
        title: data.content,
        content: data.content,
        userId: sessionData.user.id,
        groupId: selectedGroup.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      trpcUtils.bookmark.getAllByGroup.setData({ groupId: selectedGroup.id }, [
        newBookmark,
        ...previousBookmarks
      ]);

      mutationCallback?.();

      toast.success('Bookmark created');

      return { previousBookmarks, newBookmarkTempId: newBookmark.id };
    },
    onError: (err, variables, context) => {
      console.error(
        `Bookmark creation failed for content: ${variables.content}. Reverting optimistic changes.`,
        err
      );

      if (context?.previousBookmarks) {
        trpcUtils.bookmark.getAllByGroup.setData(
          { groupId: selectedGroup.id },
          context.previousBookmarks
        );
      }
    },
    onSettled: async () => {
      await trpcUtils.bookmark.getAllByGroup.invalidate({
        groupId: selectedGroup.id
      });
    }
  });
}
