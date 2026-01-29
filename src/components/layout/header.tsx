'use client';

import HostyLogo from '@/components/hosty-logo';
import LanguageSwitcher from '@/components/language-switcher';
import { useLanguage } from '@/hooks/use-language';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <HostyLogo />
            <h1 className="font-headline text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-tight">
              {t('title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
