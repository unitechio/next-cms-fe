'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
    currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChanging, setIsChanging] = useState(false);

    const handleLocaleChange = async (newLocale: Locale) => {
        if (newLocale === currentLocale) return;

        setIsChanging(true);

        // Remove current locale from pathname
        const segments = pathname.split('/').filter(Boolean);
        const pathWithoutLocale = segments.slice(1).join('/');

        // Navigate to new locale
        router.push(`/${newLocale}/${pathWithoutLocale}`);

        // Update user preference
        try {
            await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: { locale: newLocale },
                }),
            });
        } catch (error) {
            console.error('Failed to save language preference:', error);
        }

        setIsChanging(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isChanging}>
                    <Languages className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">
                        {localeFlags[currentLocale]} {localeNames[currentLocale]}
                    </span>
                    <span className="sm:hidden">{localeFlags[currentLocale]}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        className={currentLocale === locale ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{localeFlags[locale]}</span>
                        {localeNames[locale]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
