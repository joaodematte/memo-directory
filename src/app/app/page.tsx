import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';
import { BookmarkProvider } from '@/contexts/bookmark-context';
import { GroupProvider } from '@/contexts/group-context';
import { auth } from '@/lib/auth';
import { HydrateClient, api } from '@/trpc/server';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/');
  }

  const initialGroups = await api.group.getAllByUser();

  return (
    <HydrateClient>
      <GroupProvider initialGroups={initialGroups}>
        <BookmarkProvider>
          <div className="mx-auto w-full max-w-2xl">
            <Header user={session.user} />
            <MainContent />
          </div>
        </BookmarkProvider>
      </GroupProvider>
    </HydrateClient>
  );
}
