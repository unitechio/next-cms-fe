'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Plus, Minus, Edit } from 'lucide-react';

interface ChangesDiffViewerProps {
    oldValues: string | null;
    newValues: string | null;
}

export function ChangesDiffViewer({ oldValues, newValues }: ChangesDiffViewerProps) {
    const changes = useMemo(() => {
        if (!oldValues && !newValues) return null;

        try {
            const old = oldValues ? JSON.parse(oldValues) : {};
            const newVals = newValues ? JSON.parse(newValues) : {};

            const allKeys = new Set([...Object.keys(old), ...Object.keys(newVals)]);
            const diffs: Array<{
                key: string;
                type: 'added' | 'removed' | 'modified' | 'unchanged';
                oldValue?: any;
                newValue?: any;
            }> = [];

            allKeys.forEach((key) => {
                const hasOld = key in old;
                const hasNew = key in newVals;

                if (!hasOld && hasNew) {
                    diffs.push({ key, type: 'added', newValue: newVals[key] });
                } else if (hasOld && !hasNew) {
                    diffs.push({ key, type: 'removed', oldValue: old[key] });
                } else if (JSON.stringify(old[key]) !== JSON.stringify(newVals[key])) {
                    diffs.push({
                        key,
                        type: 'modified',
                        oldValue: old[key],
                        newValue: newVals[key]
                    });
                } else {
                    diffs.push({
                        key,
                        type: 'unchanged',
                        oldValue: old[key],
                        newValue: newVals[key]
                    });
                }
            });

            return diffs;
        } catch (error) {
            console.error('Failed to parse values:', error);
            return null;
        }
    }, [oldValues, newValues]);

    if (!changes) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No changes to display
            </div>
        );
    }

    const formatValue = (value: any): string => {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    const getChangeIcon = (type: string) => {
        switch (type) {
            case 'added':
                return <Plus className="h-4 w-4 text-green-600" />;
            case 'removed':
                return <Minus className="h-4 w-4 text-red-600" />;
            case 'modified':
                return <Edit className="h-4 w-4 text-blue-600" />;
            default:
                return null;
        }
    };

    const getChangeBadge = (type: string) => {
        switch (type) {
            case 'added':
                return <Badge className="bg-green-500 text-white">Added</Badge>;
            case 'removed':
                return <Badge className="bg-red-500 text-white">Removed</Badge>;
            case 'modified':
                return <Badge className="bg-blue-500 text-white">Modified</Badge>;
            default:
                return null;
        }
    };

    return (
        <ScrollArea className="h-[400px]">
            <div className="space-y-3">
                {changes.map((change, index) => {
                    if (change.type === 'unchanged') return null;

                    return (
                        <div
                            key={index}
                            className="p-4 rounded-lg border bg-card space-y-2"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getChangeIcon(change.type)}
                                    <span className="font-medium text-sm">{change.key}</span>
                                </div>
                                {getChangeBadge(change.type)}
                            </div>

                            {/* Values */}
                            <div className="space-y-2">
                                {change.type === 'added' && (
                                    <div className="p-3 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                        <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                                            New Value:
                                        </div>
                                        <pre className="text-xs text-green-900 dark:text-green-300 overflow-auto">
                                            {formatValue(change.newValue)}
                                        </pre>
                                    </div>
                                )}

                                {change.type === 'removed' && (
                                    <div className="p-3 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                        <div className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">
                                            Old Value:
                                        </div>
                                        <pre className="text-xs text-red-900 dark:text-red-300 overflow-auto">
                                            {formatValue(change.oldValue)}
                                        </pre>
                                    </div>
                                )}

                                {change.type === 'modified' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                            <div className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">
                                                Old Value:
                                            </div>
                                            <pre className="text-xs text-red-900 dark:text-red-300 overflow-auto">
                                                {formatValue(change.oldValue)}
                                            </pre>
                                        </div>
                                        <div className="p-3 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                            <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                                                New Value:
                                            </div>
                                            <pre className="text-xs text-green-900 dark:text-green-300 overflow-auto">
                                                {formatValue(change.newValue)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {changes.every(c => c.type === 'unchanged') && (
                    <div className="text-center py-8 text-muted-foreground">
                        No changes detected
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
