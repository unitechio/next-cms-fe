"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface DateRange {
    from: Date;
    to: Date;
}

interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState<DateRange>(
        value || {
            from: new Date(new Date().setDate(new Date().getDate() - 30)),
            to: new Date(),
        }
    );

    const presetRanges = [
        {
            label: "Today",
            getValue: () => ({
                from: new Date(),
                to: new Date(),
            }),
        },
        {
            label: "Last 7 days",
            getValue: () => ({
                from: new Date(new Date().setDate(new Date().getDate() - 7)),
                to: new Date(),
            }),
        },
        {
            label: "Last 30 days",
            getValue: () => ({
                from: new Date(new Date().setDate(new Date().getDate() - 30)),
                to: new Date(),
            }),
        },
        {
            label: "Last 90 days",
            getValue: () => ({
                from: new Date(new Date().setDate(new Date().getDate() - 90)),
                to: new Date(),
            }),
        },
        {
            label: "This year",
            getValue: () => ({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date(),
            }),
        },
    ];

    const handlePresetClick = (getValue: () => DateRange) => {
        const newRange = getValue();
        setRange(newRange);
        onChange?.(newRange);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {range?.from ? (
                        range.to ? (
                            <>
                                {format(range.from, "MMM dd, yyyy")} -{" "}
                                {format(range.to, "MMM dd, yyyy")}
                            </>
                        ) : (
                            format(range.from, "MMM dd, yyyy")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-2">
                    <div className="text-sm font-medium mb-2">Select Range</div>
                    {presetRanges.map((preset) => (
                        <Button
                            key={preset.label}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handlePresetClick(preset.getValue)}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
