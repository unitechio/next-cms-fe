'use client';

import { useState } from 'react';
import { Document } from '../types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDocumentDialogProps {
    document: Document | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShareDocumentDialog({
    document,
    open,
    onOpenChange,
}: ShareDocumentDialogProps) {
    const [expiresIn, setExpiresIn] = useState('7'); // days
    const [requireAuth, setRequireAuth] = useState(true);
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState('');

    if (!document) return null;

    const generateShareLink = () => {
        // In real implementation, call API to generate share link
        const baseUrl = window.location.origin;
        const token = Math.random().toString(36).substring(2, 15);
        const link = `${baseUrl}/share/${document.id}/${token}?expires=${expiresIn}&auth=${requireAuth}`;
        setShareLink(link);
        toast.success('Share link generated!');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share Document</DialogTitle>
                    <DialogDescription>
                        Generate a shareable link for: {document.document_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Expiration */}
                    <div className="space-y-2">
                        <Label>Link Expiration</Label>
                        <Select value={expiresIn} onValueChange={setExpiresIn}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="0">Never expires</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Require Authentication */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Require Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Users must be logged in to access
                            </p>
                        </div>
                        <Switch
                            checked={requireAuth}
                            onCheckedChange={setRequireAuth}
                        />
                    </div>

                    {/* Generate Button */}
                    {!shareLink && (
                        <Button
                            className="w-full"
                            onClick={generateShareLink}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Generate Share Link
                        </Button>
                    )}

                    {/* Share Link */}
                    {shareLink && (
                        <div className="space-y-2">
                            <Label>Share Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={shareLink}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {expiresIn === '0'
                                    ? 'This link never expires'
                                    : `This link expires in ${expiresIn} day${expiresIn === '1' ? '' : 's'}`}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    {shareLink && (
                        <Button onClick={() => {
                            setShareLink('');
                            generateShareLink();
                        }}>
                            Generate New Link
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
