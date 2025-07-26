import { Skeleton } from '@/components/ui/skeleton';

export function BookmarkSkeleton() {
  return (
    <div className="group flex items-center gap-2 px-4 py-2">
      <Skeleton className="size-4" />
      <Skeleton className="h-5 w-md" />
      <Skeleton className="ml-auto h-4 w-24" />
    </div>
  );
}
