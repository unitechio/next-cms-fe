'use client';

import { AuditLog } from '../types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    Globe,
    Monitor,
    FileText,
    ArrowRight,
    Activity,
    Database
} from 'lucide-react';

interface AuditLogDetailProps {
    log: AuditLog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuditLogDetail({ log, open, onOpenChange }: AuditLogDetailProps) {
    if (!log) return null;

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create':
                return 'text-green-600';
            case 'update':
                return 'text-blue-600';
            case 'delete':
                return 'text-red-600';
            case 'login':
                return 'text-purple-600';
            case 'logout':
                return 'text-gray-600';
            default:
                return 'text-foreground';
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-green-500';
        if (status >= 300 && status < 400) return 'bg-blue-500';
        if (status >= 400 && status < 500) return 'bg-yellow-500';
        if (status >= 500) return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Audit Log Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete information about this audit log entry
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[600px] pr-4">
                    <div className="space-y-6">
                        {/* Action Info */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Action</h4>
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                <div className="flex-1">
                                    <div className={`font-medium text-lg ${getActionColor(log.action)}`}>
                                        {log.action.toUpperCase()}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Resource: <span className="font-medium">{log.resource}</span>
                                        {log.resource_id && (
                                            <span className="ml-2">ID: {log.resource_id}</span>
                                        )}
                                    </div>
                                    {log.description && (
                                        <div className="text-sm text-muted-foreground mt-2">
                                            {log.description}
                                        </div>
                                    )}
                                </div>
                                {log.status_code && (
                                    <Badge
                                        className={`${getStatusColor(log.status_code)} text-white`}
                                    >
                                        {log.status_code}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* User Info */}
                        {log.user && (
                            <>
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">User</h4>
                                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://avatar.vercel.sh/${log.user.email}`} />
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

                        {/* Request Info */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Request Information</h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Method & Path</div>
                                        <div className="text-sm text-muted-foreground font-mono">
                                            <Badge variant="outline" className="mr-2">{log.method}</Badge>
                                            {log.path}
                                        </div>
                                    </div>
                                </div>

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

                                {log.duration !== undefined && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">Duration</div>
                                            <div className="text-sm text-muted-foreground">
                                                {log.duration}ms
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Timestamp Info */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Timestamp</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Started At</div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(log.created_at), 'PPpp')}
                                        </div>
                                    </div>
                                </div>

                                {log.finished_at && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">Finished At</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(log.finished_at), 'PPpp')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Request/Response/Changes Tabs */}
                        {(log.request_body || log.response_body || log.old_values || log.new_values) && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Details</h4>
                                    <Tabs defaultValue="request" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            {log.request_body && <TabsTrigger value="request">Request</TabsTrigger>}
                                            {log.response_body && <TabsTrigger value="response">Response</TabsTrigger>}
                                            {log.old_values && <TabsTrigger value="old">Old Values</TabsTrigger>}
                                            {log.new_values && <TabsTrigger value="new">New Values</TabsTrigger>}
                                        </TabsList>

                                        {log.request_body && (
                                            <TabsContent value="request">
                                                <div className="p-4 rounded-lg border bg-muted/50">
                                                    <pre className="text-xs overflow-auto max-h-[300px]">
                                                        {typeof log.request_body === 'string'
                                                            ? log.request_body
                                                            : JSON.stringify(JSON.parse(log.request_body), null, 2)}
                                                    </pre>
                                                </div>
                                            </TabsContent>
                                        )}

                                        {log.response_body && (
                                            <TabsContent value="response">
                                                <div className="p-4 rounded-lg border bg-muted/50">
                                                    <pre className="text-xs overflow-auto max-h-[300px]">
                                                        {typeof log.response_body === 'string'
                                                            ? log.response_body
                                                            : JSON.stringify(JSON.parse(log.response_body), null, 2)}
                                                    </pre>
                                                </div>
                                            </TabsContent>
                                        )}

                                        {log.old_values && (
                                            <TabsContent value="old">
                                                <div className="p-4 rounded-lg border bg-muted/50">
                                                    <pre className="text-xs overflow-auto max-h-[300px]">
                                                        {typeof log.old_values === 'string'
                                                            ? log.old_values
                                                            : JSON.stringify(JSON.parse(log.old_values), null, 2)}
                                                    </pre>
                                                </div>
                                            </TabsContent>
                                        )}

                                        {log.new_values && (
                                            <TabsContent value="new">
                                                <div className="p-4 rounded-lg border bg-muted/50">
                                                    <pre className="text-xs overflow-auto max-h-[300px]">
                                                        {typeof log.new_values === 'string'
                                                            ? log.new_values
                                                            : JSON.stringify(JSON.parse(log.new_values), null, 2)}
                                                    </pre>
                                                </div>
                                            </TabsContent>
                                        )}
                                    </Tabs>
                                </div>
                            </>
                        )}

                        {/* Metadata */}
                        {log.metadata && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Metadata</h4>
                                    <div className="p-4 rounded-lg border bg-card">
                                        <pre className="text-xs overflow-auto">
                                            {typeof log.metadata === 'string'
                                                ? log.metadata
                                                : JSON.stringify(JSON.parse(log.metadata), null, 2)}
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
