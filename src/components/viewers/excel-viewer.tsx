'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface ExcelViewerProps {
    url: string;
}

export function ExcelViewer({ url }: ExcelViewerProps) {
    const [data, setData] = useState<any[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadExcel = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer);
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                if (jsonData.length > 0) {
                    setHeaders(jsonData[0] as string[]);
                    setData(jsonData.slice(1));
                }
            } catch (err) {
                setError('Failed to load Excel file');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadExcel();
    }, [url]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div className="overflow-auto max-h-[600px] border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, i) => (
                            <TableHead key={i} className="font-bold bg-muted">
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            {row.map((cell, j) => (
                                <TableCell key={j}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
