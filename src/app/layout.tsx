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
  title: 'Registro y Autorización de Ingreso',
  description: 'Aplicación para el registro de huéspedes y autorización de ingreso.',
  icons: {
    icon: 'https://res.cloudinary.com/daauwbhzj/image/upload/v1768778493/Hosty_logo_ntehl5_bc77b3.jpg',
  },
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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://res.cloudinary.com/daauwbhzj/image/upload/v1768778493/Hosty_logo_ntehl5_bc77b3.jpg" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
