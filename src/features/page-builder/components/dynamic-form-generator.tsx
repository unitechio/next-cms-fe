'use client';

import { BlockSchema, BlockField } from '@/features/pages/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface DynamicFormGeneratorProps {
    schema: BlockSchema;
    config: Record<string, any>;
    onChange: (config: Record<string, any>) => void;
}

export function DynamicFormGenerator({ schema, config, onChange }: DynamicFormGeneratorProps) {
    const handleFieldChange = (fieldName: string, value: any) => {
        onChange({ ...config, [fieldName]: value });
    };

    const handleRepeaterAdd = (fieldName: string) => {
        const currentValue = config[fieldName] || [];
        onChange({ ...config, [fieldName]: [...currentValue, {}] });
    };

    const handleRepeaterRemove = (fieldName: string, index: number) => {
        const currentValue = config[fieldName] || [];
        onChange({
            ...config,
            [fieldName]: currentValue.filter((_: any, i: number) => i !== index),
        });
    };

    const handleRepeaterItemChange = (fieldName: string, index: number, itemData: any) => {
        const currentValue = config[fieldName] || [];
        const newValue = [...currentValue];
        newValue[index] = { ...newValue[index], ...itemData };
        onChange({ ...config, [fieldName]: newValue });
    };

    const renderField = (field: BlockField, value: any, onChange: (value: any) => void) => {
        // Check conditional visibility
        if (field.conditional) {
            const conditionMet = config[field.conditional.field] === field.conditional.value;
            if (!conditionMet) return null;
        }

        const fieldValue = value ?? field.default ?? '';

        switch (field.type) {
            case 'text':
                return (
                    <Input
                        value={fieldValue}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.label}
                    />
                );

            case 'richtext':
                return (
                    <RichTextEditor
                        content={fieldValue}
                        onChange={onChange}
                        placeholder={field.label}
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        value={fieldValue}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={field.validation?.min}
                        max={field.validation?.max}
                        placeholder={field.label}
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={fieldValue}
                            onCheckedChange={onChange}
                        />
                        <span className="text-sm">{fieldValue ? 'Yes' : 'No'}</span>
                    </div>
                );

            case 'select':
                return (
                    <Select value={fieldValue} onValueChange={onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'image':
                return (
                    <ImageUpload
                        value={fieldValue}
                        onChange={onChange}
                        onRemove={() => onChange('')}
                    />
                );

            case 'repeater':
                const items = fieldValue || [];
                return (
                    <div className="space-y-4">
                        {items.map((item: any, index: number) => (
                            <div key={index} className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Item {index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const newItems = items.filter((_: any, i: number) => i !== index);
                                            onChange(newItems);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {field.fields?.map((subField) => (
                                    <div key={subField.name}>
                                        <Label className="text-xs">{subField.label}</Label>
                                        {renderField(
                                            subField,
                                            item[subField.name],
                                            (subValue) => {
                                                const newItems = [...items];
                                                newItems[index] = { ...newItems[index], [subField.name]: subValue };
                                                onChange(newItems);
                                            }
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onChange([...items, {}])}
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                );

            default:
                return (
                    <Input
                        value={fieldValue}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.label}
                    />
                );
        }
    };

    return (
        <div className="space-y-6">
            {schema.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                    </Label>
                    {renderField(field, config[field.name], (value) =>
                        handleFieldChange(field.name, value)
                    )}
                    {field.validation?.pattern && (
                        <p className="text-xs text-muted-foreground">
                            Pattern: {field.validation.pattern}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
