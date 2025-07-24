import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { LogInButton } from '@/components/log-in-button';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect('/app');
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <LogInButton />
    </div>
  );
}
