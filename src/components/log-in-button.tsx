'use client';

import { GoogleIcon } from '@/components/google-icon';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function LogInButton() {
  const handleLogIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'https://app.memo.directory'
    });
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogIn}>
      <GoogleIcon className="size-4" />
      Log in with Google
    </Button>
  );
}
