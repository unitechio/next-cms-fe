// Document Types
export interface Document {
  id: number;
  document_code: string;
  entity_type: string; // "post", "order", "customer", "contract", etc.
  entity_id: number;
  document_name: string;
  document_path: string;
  document_type: string; // MIME type
  file_size: number;
  uploaded_by: string; // UUID
  uploader_name: string;
  user_permission: DocumentPermissionLevel;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type DocumentPermissionLevel = 'view' | 'comment' | 'edit' | 'owner';

export interface DocumentPermission {
  id: number;
  document_id: number;
  user_id?: string; // UUID, null if role-based
  job_title?: string; // null if user-specific
  permission_level: DocumentPermissionLevel;
  created_by: string; // UUID
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DocumentComment {
  id: number;
  document_id: number;
  user_id: string; // UUID
  comment: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface DocumentVersion {
  id: number;
  document_id: number;
  version_number: number;
  document_path: string;
  file_size: number;
  changed_by: string; // UUID
  change_note?: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Request DTOs
export interface DocumentUploadRequest {
  entity_type: string;
  entity_id: number;
  document_name: string;
  file: File;
}

export interface DocumentUpdateRequest {
  document_name: string;
}

export interface DocumentPermissionRequest {
  document_id: number;
  user_id?: string; // UUID
  job_title?: string;
  permission_level: DocumentPermissionLevel;
}

export interface DocumentCommentRequest {
  document_id: number;
  comment: string;
}

// Filter & Pagination
export interface DocumentFilter {
  search_term?: string;
  entity_type?: string;
  entity_id?: number;
  document_type?: string;
  uploaded_by?: number;
  sort_by?: 'created_at' | 'updated_at' | 'document_name' | 'file_size';
  sort_dir?: 'asc' | 'desc';
  page: number;
  page_size: number;
}

// Response DTOs
export interface DocumentResponse {
  id: number;
  document_code: string;
  entity_type: string;
  entity_id: number;
  document_name: string;
  document_path: string; // Added to match Document interface
  document_type: string;
  file_size: number;
  uploaded_by: string;
  uploader_name: string;
  created_at: string;
  updated_at: string;
  user_permission: DocumentPermissionLevel;
}

export interface PaginatedDocumentsResponse {
  data: DocumentResponse[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Helper type for entity types
export type EntityType = 
  | 'post' 
  | 'order' 
  | 'customer' 
  | 'contract' 
  | 'invoice'
  | 'general'; // For standalone documents
