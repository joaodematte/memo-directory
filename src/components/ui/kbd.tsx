import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const kbdVariants = cva(
  'bg-muted border-border inline-flex items-center justify-center rounded border font-mono font-medium shadow-sm',
  {
    variants: {
      size: {
        sm: 'h-4 min-w-4 p-1 py-2 text-xs',
        md: 'h-5 min-w-5 p-1 text-xs',
        lg: 'h-6 min-w-6 p-1 text-sm'
      }
    }
  }
);

interface KeyboardShortcutProps
  extends React.ComponentProps<'kbd'>,
    VariantProps<typeof kbdVariants> {
  keys: string[];
}

export function Kbd({
  keys,
  className,
  size = 'md',
  ...props
}: KeyboardShortcutProps) {
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <kbd key={index} className={kbdVariants({ size })} {...props}>
          {key}
        </kbd>
      ))}
    </div>
  );
}
