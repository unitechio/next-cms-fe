export const locales = ['en', 'vi', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇬🇧',
    vi: '🇻🇳',
    fr: '🇫🇷',
};
