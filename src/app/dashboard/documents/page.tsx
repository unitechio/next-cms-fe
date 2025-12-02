"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { documentService } from "@/features/documents/services/document.service";
import { Document } from "@/features/documents/types";
import { DocumentCard } from "@/features/documents/components/document-card";
import { DocumentDetail } from "@/features/documents/components/document-detail";
import { DragDropUpload } from "@/features/documents/components/drag-drop-upload";
import { DocumentPreviewModal } from "@/features/documents/components/document-preview-modal";
import { ShareDocumentDialog } from "@/features/documents/components/share-document-dialog";
import { AdvancedSearch, SearchFilters } from "@/features/documents/components/advanced-search";
import { DocumentStats } from "@/features/documents/components/document-stats";
import { RecentDocuments } from "@/features/documents/components/recent-documents";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Grid3x3, List } from "lucide-react";
import { toast } from "sonner";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [shareDocument, setShareDocument] = useState<Document | null>(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUpload, setShowUpload] = useState(false);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await documentService.getDocuments({
                page,
                page_size: 20,
                ...filters,
            });
            setDocuments(response.data || []);
            setTotalPages(response.total_pages || 1);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            toast.error("Failed to load documents");
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchDocuments();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchDocuments]);

    const handleDownload = async (document: Document) => {
        try {
            const { url } = await documentService.getDocumentViewUrl(document.id);
            window.open(url, '_blank');
            toast.success("Opening document...");
        } catch (error) {
            console.error("Failed to download document:", error);
            toast.error("Failed to download document");
        }
    };

    const handleDelete = async (document: Document) => {
        try {
            await documentService.deleteDocument(document.id);
            setDocuments(documents.filter((d) => d.id !== document.id));
            setSelectedIds(selectedIds.filter(id => id !== document.id));
            toast.success("Document deleted successfully");
        } catch (error) {
            console.error("Failed to delete document:", error);
            toast.error("Failed to delete document");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} documents?`)) return;

        try {
            await Promise.all(selectedIds.map(id => documentService.deleteDocument(id)));
            setDocuments(documents.filter((d) => !selectedIds.includes(d.id)));
            setSelectedIds([]);
            toast.success("Documents deleted successfully");
        } catch (error) {
            console.error("Failed to delete documents:", error);
            toast.error("Failed to delete some documents");
        }
    };

    const toggleSelection = (document: Document) => {
        setSelectedIds(prev =>
            prev.includes(document.id)
                ? prev.filter(id => id !== document.id)
                : [...prev, document.id]
        );
    };

    const handleViewDetails = (document: Document) => {
        setSelectedDocument(document);
        setDetailOpen(true);
    };

    const handlePreview = (document: Document) => {
        setPreviewDocument(document);
        setPreviewOpen(true);
    };

    const handleShare = (document: Document) => {
        setShareDocument(document);
        setShareOpen(true);
    };

    const handleSearch = (searchFilters: SearchFilters) => {
        setFilters(searchFilters);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Documents</h1>
                <p className="text-muted-foreground">
                    Manage your documents with enterprise-grade features.
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="documents" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="documents">All Documents</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>

                {/* All Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex gap-3 w-full sm:w-auto">
                            {selectedIds.length > 0 && (
                                <Button variant="destructive" onClick={handleBulkDelete}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete ({selectedIds.length})
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={viewMode === 'grid' ? 'bg-accent' : ''}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-accent' : ''}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Search */}
                    <AdvancedSearch onSearch={handleSearch} />

                    {/* Drag & Drop Upload */}
                    <DragDropUpload
                        entityType="general"
                        entityId={0}
                        onUploadComplete={fetchDocuments}
                    />

                    {/* Documents Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-lg mb-2">No documents found</p>
                            <p className="text-sm">Upload some files to get started.</p>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                                : "space-y-2"
                        }>
                            {documents.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    selected={selectedIds.includes(doc.id)}
                                    onSelect={toggleSelection}
                                    onView={handleViewDetails}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                    onPreview={handlePreview}
                                    onShare={handleShare}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && documents.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="stats">
                    <DocumentStats />
                </TabsContent>

                {/* Recent Tab */}
                <TabsContent value="recent">
                    <RecentDocuments
                        limit={10}
                        onDocumentClick={handleViewDetails}
                    />
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <DocumentDetail
                document={selectedDocument}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onDownload={handleDownload}
                onDelete={handleDelete}
            />

            <DocumentPreviewModal
                document={previewDocument}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                onDownload={handleDownload}
            />

            <ShareDocumentDialog
                document={shareDocument}
                open={shareOpen}
                onOpenChange={setShareOpen}
            />
        </div>
    );
}
