'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PostSchedulerProps {
    scheduledAt?: Date;
    onSchedule: (date: Date) => void;
    onClearSchedule: () => void;
}

export function PostScheduler({ scheduledAt, onSchedule, onClearSchedule }: PostSchedulerProps) {
    const [date, setDate] = useState<Date | undefined>(scheduledAt);
    const [time, setTime] = useState(
        scheduledAt ? format(scheduledAt, 'HH:mm') : '09:00'
    );

    const handleSchedule = () => {
        if (!date) return;

        const [hours, minutes] = time.split(':').map(Number);
        const scheduledDate = new Date(date);
        scheduledDate.setHours(hours, minutes, 0, 0);

        onSchedule(scheduledDate);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Schedule Publication
                </CardTitle>
                <CardDescription>
                    Set a date and time to automatically publish this post
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {scheduledAt ? (
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Scheduled for:</p>
                        <p className="text-lg">
                            {format(scheduledAt, 'MMMM d, yyyy')} at {format(scheduledAt, 'h:mm a')}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={onClearSchedule}
                        >
                            Clear Schedule
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !date && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleSchedule}
                            disabled={!date}
                            className="w-full"
                        >
                            Schedule Post
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
