import { apiClient } from '@/lib/axios';

export interface TranslatableContent {
    [locale: string]: string;
}

export interface PostTranslations {
    title_translations?: TranslatableContent;
    content_translations?: TranslatableContent;
    excerpt_translations?: TranslatableContent;
}

export interface CategoryTranslations {
    name_translations?: TranslatableContent;
    description_translations?: TranslatableContent;
}

export const translationService = {
    // Get all translations for a locale
    getTranslations: async (locale: string, namespace: string = 'common') => {
        const res = await apiClient.get(`/translations/${locale}`, {
            params: { namespace },
        });
        return res.data.data as Record<string, string>;
    },

    // Set a translation
    setTranslation: async (key: string, locale: string, value: string, namespace: string = 'common') => {
        await apiClient.post('/translations', {
            key,
            locale,
            value,
            namespace,
        });
    },

    // Bulk set translations
    bulkSetTranslations: async (
        translations: Record<string, Record<string, string>>,
        namespace: string = 'common'
    ) => {
        await apiClient.post('/translations/bulk', {
            translations,
            namespace,
        });
    },

    // Get supported locales
    getSupportedLocales: async () => {
        const res = await apiClient.get('/translations/locales');
        return res.data.data as string[];
    },

    // Get namespaces
    getNamespaces: async () => {
        const res = await apiClient.get('/translations/namespaces');
        return res.data.data as string[];
    },
};

// Helper to get translated content
export function getTranslatedContent(
    translations: TranslatableContent | undefined,
    locale: string,
    fallback: string = ''
): string {
    if (!translations) return fallback;
    return translations[locale] || translations['en'] || fallback;
}
