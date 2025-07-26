import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';
import { auth } from '@/lib/auth';
import { GroupStoreProvider } from '@/providers/group-store-provider';
import { HydrateClient, api } from '@/trpc/server';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/auth');
  }

  const initialGroups = await api.group.getAllByUser();

  return (
    <HydrateClient>
      <GroupStoreProvider initialGroups={initialGroups}>
        <div className="mx-auto w-full max-w-2xl px-6">
          <Header user={session.user} />
          <MainContent />
        </div>
      </GroupStoreProvider>
    </HydrateClient>
  );
}
