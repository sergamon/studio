import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClientProviders } from '@/components/client-providers';

// FIX: Remove broken localStorage polyfill/mock from environment
if (typeof global !== 'undefined' && (global as any).localStorage) {
  try {
    delete (global as any).localStorage;
    console.log('SERVER FIX: Deleted broken global.localStorage');
  } catch (e) {
    console.error('SERVER FIX: Failed to delete global.localStorage', e);
  }
}

export const metadata: Metadata = {
  title: 'Hosty | Registro y Autorización de Ingreso',
  description: 'Aplicación para el registro de huéspedes y autorización de ingreso.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
