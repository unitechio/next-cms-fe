'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

interface TranslationEditorProps {
    field: 'title' | 'content' | 'excerpt' | 'name' | 'description';
    translations?: Record<string, string>;
    onChange: (translations: Record<string, string>) => void;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
}

export function TranslationEditor({
    field,
    translations = {},
    onChange,
    multiline = false,
    rows = 4,
    placeholder,
}: TranslationEditorProps) {
    const [values, setValues] = useState<Record<string, string>>(translations);

    const handleChange = (locale: string, value: string) => {
        const newValues = { ...values, [locale]: value };
        setValues(newValues);
        onChange(newValues);
    };

    const getPlaceholder = (locale: Locale) => {
        if (placeholder) return placeholder;
        return `Enter ${field} in ${localeNames[locale]}`;
    };

    return (
        <div className="space-y-2">
            <Label>
                {field.charAt(0).toUpperCase() + field.slice(1)} (All Languages)
            </Label>

            <Tabs defaultValue={locales[0]} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${locales.length}, 1fr)` }}>
                    {locales.map((locale) => (
                        <TabsTrigger key={locale} value={locale} className="text-xs sm:text-sm">
                            <span className="mr-1">{localeFlags[locale]}</span>
                            <span className="hidden sm:inline">{localeNames[locale]}</span>
                            <span className="sm:hidden">{locale.toUpperCase()}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {locales.map((locale) => (
                    <TabsContent key={locale} value={locale} className="mt-2">
                        {multiline ? (
                            <Textarea
                                value={values[locale] || ''}
                                onChange={(e) => handleChange(locale, e.target.value)}
                                placeholder={getPlaceholder(locale)}
                                rows={rows}
                                className="w-full"
                            />
                        ) : (
                            <Input
                                value={values[locale] || ''}
                                onChange={(e) => handleChange(locale, e.target.value)}
                                placeholder={getPlaceholder(locale)}
                                className="w-full"
                            />
                        )}

                        {values[locale] && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {values[locale].length} characters
                            </p>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
