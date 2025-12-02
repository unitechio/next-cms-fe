'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUserImportProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface ImportResult {
    total: number;
    success: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
}

export function BulkUserImport({ open, onOpenChange, onSuccess }: BulkUserImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<ImportResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                toast.error('Please select a CSV file');
                return;
            }
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setImporting(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            // TODO: Replace with actual API call
            // const response = await userService.bulkImport(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            clearInterval(progressInterval);
            setProgress(100);

            // Mock result
            const mockResult: ImportResult = {
                total: 10,
                success: 8,
                failed: 2,
                errors: [
                    { row: 3, error: 'Invalid email format' },
                    { row: 7, error: 'Duplicate email' },
                ],
            };

            setResult(mockResult);
            toast.success(`Imported ${mockResult.success} users successfully`);

            if (mockResult.failed === 0) {
                onSuccess?.();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to import users');
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = 'first_name,last_name,email,role\nJohn,Doe,john@example.com,editor\nJane,Smith,jane@example.com,viewer';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-import-template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Template downloaded');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Bulk Import Users</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to import multiple users at once
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Template Download */}
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="font-medium text-sm">Download Template</div>
                                <div className="text-xs text-muted-foreground">
                                    Get the CSV template with required columns
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={downloadTemplate}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="file">Upload CSV File</Label>
                        <div className="flex gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                disabled={importing}
                            />
                            <Button
                                onClick={handleImport}
                                disabled={!file || importing}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Import
                            </Button>
                        </div>
                        {file && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {file.name}
                            </p>
                        )}
                    </div>

                    {/* Progress */}
                    {importing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Importing users...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg border bg-card text-center">
                                    <div className="text-2xl font-bold">{result.total}</div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                </div>
                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20 text-center">
                                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        {result.success}
                                    </div>
                                    <div className="text-xs text-green-700 dark:text-green-400">Success</div>
                                </div>
                                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20 text-center">
                                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-600">
                                        <XCircle className="h-5 w-5" />
                                        {result.failed}
                                    </div>
                                    <div className="text-xs text-red-700 dark:text-red-400">Failed</div>
                                </div>
                            </div>

                            {result.errors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium mb-2">Import Errors:</div>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {result.errors.map((error, index) => (
                                                <li key={index}>
                                                    Row {error.row}: {error.error}
                                                </li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="font-medium text-sm mb-2">CSV Format Requirements:</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Required columns: first_name, last_name, email</li>
                            <li>• Optional columns: role, phone, department</li>
                            <li>• Email must be unique</li>
                            <li>• Maximum 1000 users per import</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
