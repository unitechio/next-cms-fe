'use client';

import { useState } from 'react';
import { usePageBuilderStore } from '../store/page-builder-store';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
    const { currentLanguage, setLanguage, pageBlocks } = usePageBuilderStore();

    // Count missing translations
    const missingTranslations = pageBlocks.filter(
        (block) => !block.language || block.language !== currentLanguage
    ).length;

    return (
        <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={currentLanguage} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {missingTranslations > 0 && (
                <Badge variant="destructive" className="text-xs">
                    {missingTranslations} missing
                </Badge>
            )}
        </div>
    );
}
