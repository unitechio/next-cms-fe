'use client';

import { ActivityLog, getActivityCategory, getActivityIcon, getActivityColor } from '../types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Clock, Globe, Monitor, User } from 'lucide-react';

interface ActivityLogDetailProps {
    log: ActivityLog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivityLogDetail({ log, open, onOpenChange }: ActivityLogDetailProps) {
    if (!log) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{getActivityIcon(log.activity)}</span>
                        Activity Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about this activity
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[500px] pr-4">
                    <div className="space-y-6">
                        {/* Activity Info */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Activity</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                    <div className="flex-1">
                                        <div className={`font-medium ${getActivityColor(log.activity)}`}>
                                            {log.activity}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {log.description}
                                        </div>
                                    </div>
                                    <Badge variant="outline">
                                        {getActivityCategory(log.activity)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* User Info */}
                        {log.user && (
                            <>
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">User</h4>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={log.user.avatar_url || `https://avatar.vercel.sh/${log.user.email}`} />
                                            <AvatarFallback>
                                                {log.user.first_name?.[0]}
                                                {log.user.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {log.user.first_name} {log.user.last_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {log.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Technical Details */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Technical Details</h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">IP Address</div>
                                        <div className="text-sm text-muted-foreground font-mono">
                                            {log.ip_address || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <Monitor className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">User Agent</div>
                                        <div className="text-xs text-muted-foreground break-all">
                                            {log.user_agent || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Date</div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(log.created_at), 'MMMM d, yyyy')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Time</div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(log.created_at), 'HH:mm:ss')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Additional Information</h4>
                                    <div className="p-3 rounded-lg border bg-card">
                                        <pre className="text-xs overflow-auto">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
