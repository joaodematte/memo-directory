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
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel
} from '@/components/ui/field';
import { Kbd } from '@/components/ui/kbd';
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

  const { data: authData } = authClient.useSession();
  const { setSelectedGroup } = useGroup();

  const { mutateAsync: createGroup, isPending } = api.group.create.useMutation({
    onMutate: async (data) => {
      await trpcUtils.group.getAllByUser.cancel();

      const previousGroups = trpcUtils.group.getAllByUser.getData();

      if (!previousGroups || !authData) return;

      const newGroup = {
        id: uuidv7(),
        name: data.name,
        color: data.color,
        userId: authData.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      trpcUtils.group.getAllByUser.setData(undefined, [
        ...previousGroups,
        newGroup
      ]);

      setSelectedGroup(newGroup);
      toggleDialog();
      form.reset();

      toast.success('Group created');
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
      <DialogContent
        render={(props) => <form onSubmit={handleFormSubmit} {...props} />}
      >
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
              <Field>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <FieldControl
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="color">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                <FieldControl
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>
                  You can&apos;t change it later.
                </FieldDescription>
                <HexColorPicker
                  style={{ width: '100%' }}
                  color={field.state.value}
                  onChange={(color) => field.handleChange(color)}
                />
              </Field>
            )}
          </form.Field>
        </div>
        <DialogFooter>
          <DialogClose
            disabled={isPending}
            render={(props) => (
              <Button variant="ghost" {...props}>
                Close
                <Kbd className="w-8">Esc</Kbd>
              </Button>
            )}
          />

          <Button disabled={isPending}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
