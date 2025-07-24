import { Field as FieldBase } from '@base-ui-components/react/field';

import { cn } from '@/lib/utils';

export function Field({
  className,
  ...props
}: React.ComponentProps<typeof FieldBase.Root>) {
  return (
    <FieldBase.Root
      data-slot="field-root"
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldBase.Label>) {
  return (
    <FieldBase.Label
      data-slot="field-label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function FieldControl(
  props: React.ComponentProps<typeof FieldBase.Control>
) {
  return (
    <FieldBase.Control
      data-slot="field-control"
      className={cn(
        'placeholder:text-muted-foreground bg-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/50 aria-invalid:border-destructive'
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldBase.Description>) {
  return (
    <FieldBase.Description
      data-slot="field-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof FieldBase.Error>) {
  return (
    <FieldBase.Error
      data-slot="field-error"
      className={cn('text-destructive text-sm', className)}
      {...props}
    />
  );
}

export function FieldValidity(
  props: React.ComponentProps<typeof FieldBase.Validity>
) {
  return <FieldBase.Validity data-slot="field-validity" {...props} />;
}
