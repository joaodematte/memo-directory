import { useForm } from '@tanstack/react-form';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { useGroup } from '@/contexts/group-context';
import { authClient } from '@/lib/auth-client';
import { api } from '@/trpc/react';

interface CreateGroupDialogProps extends React.ComponentProps<typeof Dialog> {
  toggleDialog: () => void;
}

const schema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  color: z.string().min(1, { message: 'Required' })
});

export function CreateGroupDialog({
  toggleDialog,
  ...props
}: CreateGroupDialogProps) {
  const trpcUtils = api.useUtils();

  const { data: sessionData } = authClient.useSession();
  const { setSelectedGroup } = useGroup();

  const { mutateAsync: createGroup, isPending } = api.group.create.useMutation({
    onMutate: async (data) => {
      await trpcUtils.group.getAllByUser.cancel();

      const previousGroups = trpcUtils.group.getAllByUser.getData();

      if (!previousGroups || !sessionData) {
        console.warn(
          'No previous group data or session data found in cache. Optimistic delete skipped.'
        );

        return { previousGroups };
      }
      const newGroup = {
        id: uuidv7(),
        name: data.name,
        color: data.color,
        userId: sessionData.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      trpcUtils.group.getAllByUser.setData(undefined, [
        ...previousGroups,
        newGroup
      ]);

      console.log(data);

      setSelectedGroup(newGroup);
      toggleDialog();
      form.reset();

      toast.success('Group created');

      return { previousGroups, newGroupTempId: newGroup.id };
    },
    onError: (err, variables, context) => {
      console.error(
        `Group creation failed for name: ${variables.name}. Reverting optimistic changes.`,
        err
      );

      if (context?.previousGroups) {
        trpcUtils.group.getAllByUser.setData(undefined, context.previousGroups);
      }

      toast.error(`Failed to create group: ${err.message || 'Unknown error'}`);
    },
    onSettled: async () => {
      await trpcUtils.group.getAllByUser.invalidate();
    }
  });

  const form = useForm({
    defaultValues: {
      name: '',
      color: '#fee685'
    },
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value }) => {
      await createGroup(value);
    }
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await form.handleSubmit();
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <form onSubmit={handleFormSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a new group here to separate your bookmarks.
              <br />
              Click confirm when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <form.Field name="name">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="color">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Color</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <HexColorPicker
                    style={{ width: '100%' }}
                    color={field.state.value}
                    onChange={(color) => field.handleChange(color)}
                  />
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">
                Close
                <Kbd className="w-8">Esc</Kbd>
              </Button>
            </DialogClose>

            <Button disabled={isPending}>Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
