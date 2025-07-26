import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/sonner';

interface ProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="bottom-center" />
    </ThemeProvider>
  );
}
