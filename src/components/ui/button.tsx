'use client';

import { mergeProps } from '@base-ui-components/react';
import { useRender } from '@base-ui-components/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80 shadow-xs',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
        ghost:
          'text-foreground hover:bg-accent/80 hover:text-accent-foreground',
        outline:
          'text-foreground hover:bg-accent/80 hover:text-accent-foreground border bg-transparent shadow-xs',
        link: 'text-foreground hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/80 focus-visible:ring-destructive/50 shadow-xs'
      },
      size: {
        'sm': 'h-8 gap-1 px-3',
        'md': 'h-9 px-4',
        'lg': 'h-10 px-5',
        'icon-sm': "size-8 [&_svg:not([class*='size-'])]:size-3",
        'icon': 'size-9',
        'icon-lg': "size-10 [&_svg:not([class*='size-'])]:size-5"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    useRender.ComponentProps<'button'> {}

function Button({
  className,
  variant,
  size,
  render = <button />,
  ...props
}: ButtonProps) {
  const defaultProps = {
    'data-slot': 'button',
    'className': cn(buttonVariants({ variant, size, className }))
  } as const;

  const element = useRender({
    render,
    props: mergeProps<'button'>(defaultProps, props)
  });

  return element;
}

export { Button, buttonVariants };
