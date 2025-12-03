'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
    value?: Locale;
    onChange: (locale: Locale) => void;
    label?: string;
    description?: string;
    showIcon?: boolean;
    disabled?: boolean;
    className?: string;
}

export function LanguageSelector({
    value = 'en',
    onChange,
    label = 'Language',
    description,
    showIcon = true,
    disabled = false,
    className,
}: LanguageSelectorProps) {
    return (
        <div className={className}>
            {label && <Label className="mb-2 flex items-center gap-2">
                {showIcon && <Languages className="h-4 w-4" />}
                {label}
            </Label>}

            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                            <span className="flex items-center gap-2">
                                <span>{localeFlags[locale]}</span>
                                <span>{localeNames[locale]}</span>
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </div>
    );
}
