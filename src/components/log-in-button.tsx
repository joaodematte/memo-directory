'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function LogInButton() {
  const handleLogIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/app'
    });
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogIn}>
      Log in with Google
    </Button>
  );
}
