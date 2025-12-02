'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Palette } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    typography: {
        fontFamily: string;
        headingSize: string;
        bodySize: string;
    };
    spacing: {
        containerPadding: string;
        sectionGap: string;
    };
}

const DEFAULT_THEME: ThemeConfig = {
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        headingSize: '2.5rem',
        bodySize: '1rem',
    },
    spacing: {
        containerPadding: '1rem',
        sectionGap: '4rem',
    },
};

export function ThemeManager() {
    const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);

    const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
        setTheme((prev) => ({
            ...prev,
            colors: { ...prev.colors, [key]: value },
        }));
    };

    const handleTypographyChange = (
        key: keyof ThemeConfig['typography'],
        value: string
    ) => {
        setTheme((prev) => ({
            ...prev,
            typography: { ...prev.typography, [key]: value },
        }));
    };

    const handleSpacingChange = (
        key: keyof ThemeConfig['spacing'],
        value: string
    ) => {
        setTheme((prev) => ({
            ...prev,
            spacing: { ...prev.spacing, [key]: value },
        }));
    };

    const handleSave = () => {
        // Save to localStorage or API
        localStorage.setItem('pageBuilderTheme', JSON.stringify(theme));
        // Apply theme to document
        document.documentElement.style.setProperty('--primary', theme.colors.primary);
        document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <Palette className="mr-2 h-4 w-4" />
                    Theme
                </Button>
            </SheetTrigger>
            <SheetContent className="w-96">
                <SheetHeader>
                    <SheetTitle>Theme Settings</SheetTitle>
                    <SheetDescription>
                        Customize global colors, typography, and spacing
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                    <div className="space-y-6 py-6">
                        {/* Colors */}
                        <div>
                            <h3 className="mb-3 font-semibold">Colors</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="primary">Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="primary"
                                            type="color"
                                            value={theme.colors.primary}
                                            onChange={(e) => handleColorChange('primary', e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={theme.colors.primary}
                                            onChange={(e) => handleColorChange('primary', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="secondary">Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="secondary"
                                            type="color"
                                            value={theme.colors.secondary}
                                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={theme.colors.secondary}
                                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="background">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="background"
                                            type="color"
                                            value={theme.colors.background}
                                            onChange={(e) => handleColorChange('background', e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={theme.colors.background}
                                            onChange={(e) => handleColorChange('background', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="text">Text Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="text"
                                            type="color"
                                            value={theme.colors.text}
                                            onChange={(e) => handleColorChange('text', e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={theme.colors.text}
                                            onChange={(e) => handleColorChange('text', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Typography */}
                        <div>
                            <h3 className="mb-3 font-semibold">Typography</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="fontFamily">Font Family</Label>
                                    <Input
                                        id="fontFamily"
                                        value={theme.typography.fontFamily}
                                        onChange={(e) =>
                                            handleTypographyChange('fontFamily', e.target.value)
                                        }
                                        placeholder="Inter, sans-serif"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="headingSize">Heading Size</Label>
                                    <Input
                                        id="headingSize"
                                        value={theme.typography.headingSize}
                                        onChange={(e) =>
                                            handleTypographyChange('headingSize', e.target.value)
                                        }
                                        placeholder="2.5rem"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bodySize">Body Size</Label>
                                    <Input
                                        id="bodySize"
                                        value={theme.typography.bodySize}
                                        onChange={(e) => handleTypographyChange('bodySize', e.target.value)}
                                        placeholder="1rem"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Spacing */}
                        <div>
                            <h3 className="mb-3 font-semibold">Spacing</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="containerPadding">Container Padding</Label>
                                    <Input
                                        id="containerPadding"
                                        value={theme.spacing.containerPadding}
                                        onChange={(e) =>
                                            handleSpacingChange('containerPadding', e.target.value)
                                        }
                                        placeholder="1rem"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="sectionGap">Section Gap</Label>
                                    <Input
                                        id="sectionGap"
                                        value={theme.spacing.sectionGap}
                                        onChange={(e) => handleSpacingChange('sectionGap', e.target.value)}
                                        placeholder="4rem"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="border-t pt-4">
                    <Button onClick={handleSave} className="w-full">
                        Save Theme
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
