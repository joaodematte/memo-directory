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
    <div className="mx-auto my-45 w-full max-w-2xl space-y-6 px-6">
      <section>
        <h1 className="font-semibold">memo.directory</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your personal vault for valuable hyperlinks. A simple, no-frills
          approach to saving and accessing the content that matters most to you.
        </p>
      </section>
      <section>
        <h1 className="font-semibold">About</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Designed with personal preferences in mind, this tool offers a
          minimal, keyboard-first experience. It automatically detects input
          content types and renders links with relevant page metadata. Enjoy
          fast loading, no onboarding, no tracking, and absolutely no ads.
        </p>
      </section>
      <section>
        <LogInButton />
      </section>
    </div>
  );
}
