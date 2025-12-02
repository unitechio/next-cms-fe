import { apiClient } from '@/lib/axios';
import {
  Document,
  DocumentFilter,
  DocumentUploadRequest,
  DocumentUpdateRequest,
  DocumentPermissionRequest,
  DocumentCommentRequest,
  PaginatedDocumentsResponse,
  DocumentPermission,
  DocumentComment,
  DocumentVersion,
} from '../types';

export const documentService = {
  /**
   * Upload a new document
   */
  uploadDocument: async (request: DocumentUploadRequest) => {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('entity_type', request.entity_type);
    formData.append('entity_id', request.entity_id.toString());
    formData.append('document_name', request.document_name);

    const response = await apiClient.post<{ success: boolean; document: Document }>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.document;
  },

  /**
   * Get documents with filtering and pagination
   */
  getDocuments: async (filter: DocumentFilter) => {
    const params = new URLSearchParams();
    
    if (filter.search_term) params.append('search_term', filter.search_term);
    if (filter.entity_type) params.append('entity_type', filter.entity_type);
    if (filter.entity_id) params.append('entity_id', filter.entity_id.toString());
    if (filter.document_type) params.append('document_type', filter.document_type);
    if (filter.uploaded_by) params.append('uploaded_by', filter.uploaded_by.toString());
    if (filter.sort_by) params.append('sort_by', filter.sort_by);
    if (filter.sort_dir) params.append('sort_dir', filter.sort_dir);
    params.append('page', filter.page.toString());
    params.append('page_size', filter.page_size.toString());

    console.log('🔍 DEBUG: About to call getDocuments API');
    console.log('📋 Filter params:', filter);
    console.log('🔗 URL:', `/documents/list?${params.toString()}`);
    // debugger; // REMOVED

    const response = await apiClient.get<PaginatedDocumentsResponse>(
      `/documents/list?${params.toString()}`
    );
    
    console.log('✅ API Response:', response.data);
    return response.data;
  },

  /**
   * Get documents by entity (e.g., all documents for a specific post)
   */
  getDocumentsByEntity: async (entityType: string, entityId: number) => {
    const response = await apiClient.get<Document[]>(
      `/documents/entity/${entityType}/${entityId}`
    );
    return response.data;
  },

  /**
   * Get a single document by ID
   */
  getDocumentById: async (id: number) => {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  /**
   * Get a document by its unique code
   */
  getDocumentByCode: async (code: string) => {
    const response = await apiClient.get<Document>(`/documents/code/${code}`);
    return response.data;
  },

  /**
   * Update document metadata
   */
  updateDocument: async (id: number, request: DocumentUpdateRequest) => {
    const response = await apiClient.put<{ success: boolean; document: Document }>(
      `/documents/${id}`,
      request
    );
    return response.data.document;
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: number) => {
    await apiClient.delete(`/documents/${id}`);
  },

  /**
   * Get a presigned URL for viewing/downloading
   */
  getDocumentViewUrl: async (id: number) => {
    const response = await apiClient.get<{ url: string; expires_at: string }>(
      `/documents/view-url/${id}`
    );
    return response.data;
  },

  /**
   * Download a document
   */
  downloadDocument: async (id: number) => {
    const response = await apiClient.get(`/documents/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ==================== PERMISSIONS ====================

  /**
   * Add a permission to a document
   */
  addPermission: async (request: DocumentPermissionRequest) => {
    const response = await apiClient.post<{ success: boolean; permission: DocumentPermission }>(
      '/documents/permissions',
      request
    );
    return response.data.permission;
  },

  /**
   * Get all permissions for a document
   */
  getPermissions: async (documentId: number) => {
    const response = await apiClient.get<DocumentPermission[]>(
      `/documents/${documentId}/permissions`
    );
    return response.data;
  },

  /**
   * Update a permission
   */
  updatePermission: async (permissionId: number, permissionLevel: string) => {
    const response = await apiClient.put<{ success: boolean; permission: DocumentPermission }>(
      `/documents/permissions/${permissionId}`,
      { permission_level: permissionLevel }
    );
    return response.data.permission;
  },

  /**
   * Delete a permission
   */
  deletePermission: async (permissionId: number) => {
    await apiClient.delete(`/documents/permissions/${permissionId}`);
  },

  // ==================== COMMENTS ====================

  /**
   * Add a comment to a document
   */
  addComment: async (request: DocumentCommentRequest) => {
    const response = await apiClient.post<{ success: boolean; comment: DocumentComment }>(
      '/documents/comments',
      request
    );
    return response.data.comment;
  },

  /**
   * Get all comments for a document
   */
  getComments: async (documentId: number) => {
    const response = await apiClient.get<DocumentComment[]>(
      `/documents/${documentId}/comments`
    );
    return response.data;
  },

  /**
   * Update a comment
   */
  updateComment: async (commentId: number, comment: string) => {
    const response = await apiClient.put<{ success: boolean; comment: DocumentComment }>(
      `/documents/comments/${commentId}`,
      { comment }
    );
    return response.data.comment;
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: number) => {
    await apiClient.delete(`/documents/comments/${commentId}`);
  },

  // ==================== VERSIONS ====================

  /**
   * Get version history for a document
   */
  getVersions: async (documentId: number) => {
    const response = await apiClient.get<DocumentVersion[]>(
      `/documents/${documentId}/versions`
    );
    return response.data;
  },
};
