'use client';

import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';

// Cargar LanguageProvider solo en cliente (sin SSR)
const LanguageProvider = dynamic(
    () => import('@/contexts/language-context').then((m) => m.LanguageProvider),
    { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {children}
            <Toaster />
        </LanguageProvider>
    );
}
