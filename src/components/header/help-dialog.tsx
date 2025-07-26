import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

const shortcuts = [
  {
    name: 'Focus input',
    keys: ['⌘', 'K']
  },
  {
    name: 'Focus list',
    keys: ['⌘', 'L']
  },
  {
    name: 'Open in new tab',
    keys: ['⌘', 'Enter']
  },
  {
    name: 'Edit bookmark',
    keys: ['⌘', 'E']
  },
  {
    name: 'Delete bookmark',
    keys: ['⌘', 'D']
  },
  {
    name: 'Copy bookmark URL',
    keys: ['⌘', 'C']
  },
  {
    name: 'Paste and create new bookmark',
    keys: ['⌘', 'V']
  }
];

export function HelpDialog(props: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>memo.directory</DialogTitle>
          <DialogDescription>
            Here is a list of shortcuts to help you navigate the app.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
              {shortcuts.map(({ name, keys }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm">{name}</span>
                  <Kbd keys={keys} />
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            * On Windows and Linux, use Alt instead of ⌘
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
