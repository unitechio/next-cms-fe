# 📋 MIGRATION PLAN: Media → Document Management System

## 🎯 Mục tiêu
Chuyển đổi từ hệ thống **Media** đơn giản sang **Document Management** toàn diện để hỗ trợ:
- ✅ Permission management (view, edit, comment, owner)
- ✅ Document versioning
- ✅ Collaboration (comments)
- ✅ Entity-based organization
- ✅ Enterprise-grade features

---

## 🔍 So sánh Media vs Document

### **Media (Hiện tại)**
```typescript
interface Media {
  id: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}
```
**Tính năng:**
- Upload/Delete files
- Simple listing
- No permissions
- No versioning
- No collaboration

### **Document (Backend đã có)**
```typescript
interface Document {
  id: number;
  document_code: string;
  entity_type: string;      // "order", "customer", "post", etc.
  entity_id: number;
  document_name: string;
  document_path: string;
  document_type: string;    // MIME type
  file_size: number;
  uploaded_by: string;
  uploader_name: string;
  user_permission: string;  // "view", "edit", "comment", "owner"
  created_at: string;
  updated_at: string;
}
```
**Tính năng:**
- ✅ Upload/Download/Delete
- ✅ Permission system (4 levels)
- ✅ Version control
- ✅ Comments & collaboration
- ✅ Entity relationships
- ✅ Audit trail

---

## 📝 Migration Steps

### **Phase 1: Fix Current Issues (DONE ✅)**
- [x] Fix `media.map is not a function` error
- [x] Use `parseApiResponse` utility for safe data handling

### **Phase 2: Create Document Types & Services**
1. **Create Document Types**
   - `src/features/documents/types/index.ts`
   - Define Document, DocumentPermission, DocumentComment, DocumentVersion interfaces

2. **Create Document Service**
   - `src/features/documents/services/document.service.ts`
   - Implement all API calls matching backend endpoints:
     - `uploadDocument()`
     - `getDocuments()`
     - `getDocumentsByEntity()`
     - `getDocumentById()`
     - `updateDocument()`
     - `deleteDocument()`
     - `downloadDocument()`
     - `addPermission()`
     - `getPermissions()`
     - `addComment()`
     - `getComments()`
     - `getVersions()`

### **Phase 3: Create Document Components**
1. **Document Library Modal**
   - `src/features/documents/components/document-library-modal.tsx`
   - Similar to MediaLibraryModal but with:
     - Permission badges
     - Entity type filters
     - Version indicators

2. **Document Detail Panel**
   - `src/features/documents/components/document-detail.tsx`
   - Show permissions
   - Show comments
   - Show version history
   - Download/Delete actions

3. **Document Permissions Manager**
   - `src/features/documents/components/document-permissions.tsx`
   - Add/Edit/Remove permissions
   - User/Role selector

4. **Document Comments**
   - `src/features/documents/components/document-comments.tsx`
   - Add/Edit/Delete comments
   - Real-time collaboration

5. **Document Version History**
   - `src/features/documents/components/document-versions.tsx`
   - List all versions
   - Compare versions
   - Restore previous version

### **Phase 4: Create Document Management Page**
- `src/app/dashboard/documents/page.tsx`
- Full-featured document management UI
- Filters: entity type, permissions, date range
- Bulk operations
- Advanced search

### **Phase 5: Update Rich Text Editor**
- Update `RichTextEditor` to use Document Library instead of Media Library
- Support entity context (e.g., when editing a post, link documents to that post)

### **Phase 6: Update Post Form**
- Add document attachment section
- Link documents to posts (entity_type: "post", entity_id: post.id)
- Show attached documents with permissions

### **Phase 7: Backend Integration**
- Ensure backend `/api/v1/documents` endpoints are registered in router
- Test all endpoints
- Add proper error handling

### **Phase 8: Migration & Cleanup**
- Migrate existing media to documents (if needed)
- Deprecate old media endpoints
- Remove unused media components
- Update documentation

---

## 🚀 Implementation Priority

### **High Priority (Do First)**
1. ✅ Fix current media.map error
2. Create Document types & service
3. Create basic Document Library Modal
4. Update RichTextEditor to use documents

### **Medium Priority**
5. Create Document Management Page
6. Implement permissions UI
7. Implement comments UI

### **Low Priority**
8. Version history UI
9. Advanced filters
10. Bulk operations

---

## 🔧 Technical Decisions

### **API Endpoints (Backend)**
```
POST   /api/v1/documents/upload
GET    /api/v1/documents
GET    /api/v1/documents/:id
GET    /api/v1/documents/code/:code
PUT    /api/v1/documents/:id
DELETE /api/v1/documents/:id
GET    /api/v1/documents/:id/download
GET    /api/v1/documents/:id/view-url

# Permissions
POST   /api/v1/documents/:id/permissions
GET    /api/v1/documents/:id/permissions
PUT    /api/v1/documents/:id/permissions/:permissionId
DELETE /api/v1/documents/:id/permissions/:permissionId

# Comments
POST   /api/v1/documents/:id/comments
GET    /api/v1/documents/:id/comments
PUT    /api/v1/documents/:id/comments/:commentId
DELETE /api/v1/documents/:id/comments/:commentId

# Versions
GET    /api/v1/documents/:id/versions
```

### **Frontend Structure**
```
src/features/documents/
├── types/
│   └── index.ts
├── services/
│   └── document.service.ts
├── components/
│   ├── document-library-modal.tsx
│   ├── document-detail.tsx
│   ├── document-permissions.tsx
│   ├── document-comments.tsx
│   ├── document-versions.tsx
│   ├── document-filters.tsx
│   └── document-card.tsx
└── hooks/
    ├── use-documents.ts
    ├── use-document-permissions.ts
    └── use-document-comments.ts
```

---

## ⚠️ Breaking Changes

1. **API Response Structure**
   - Media: Simple array or `{ data: [] }`
   - Document: `{ data: [], meta: { total, page, limit } }`

2. **File Upload**
   - Media: `/media/upload`
   - Document: `/documents/upload` (requires entity_type, entity_id)

3. **Permissions**
   - Media: No permissions
   - Document: User-level permissions required

---

## 📊 Benefits of Migration

### **For Users**
- ✅ Better organization (entity-based)
- ✅ Collaboration features (comments)
- ✅ Version control (track changes)
- ✅ Fine-grained permissions

### **For Developers**
- ✅ Scalable architecture
- ✅ Enterprise-ready
- ✅ Better security
- ✅ Audit trail

### **For Business**
- ✅ Compliance-ready
- ✅ Better data governance
- ✅ Team collaboration
- ✅ Professional features

---

## 🎯 Next Steps

**Immediate Actions:**
1. Review this plan with team
2. Decide on migration timeline
3. Start Phase 2: Create Document types & services
4. Test backend endpoints

**Questions to Answer:**
- Should we keep Media for simple use cases?
- Migration strategy for existing media files?
- Timeline for full rollout?
- Training needed for new features?

---

## 📅 Estimated Timeline

- **Phase 1:** ✅ Done (30 minutes)
- **Phase 2-3:** 4-6 hours (Types, Services, Basic Components)
- **Phase 4:** 3-4 hours (Document Management Page)
- **Phase 5-6:** 2-3 hours (Editor & Post Integration)
- **Phase 7-8:** 2-3 hours (Testing & Cleanup)

**Total:** ~12-16 hours of development

---

## 🤔 Recommendation

**Tôi khuyến nghị:**
1. ✅ **Migrate sang Document** - Đầy đủ tính năng, dễ scale
2. ⚠️ **Giữ Media cho simple cases** - Nếu cần upload nhanh không cần permissions
3. 🎯 **Priority:** Implement Document Library Modal trước để fix vấn đề hiện tại

**Bạn muốn:**
- A) Bắt đầu implement Document ngay (recommended)
- B) Chỉ fix lỗi Media và giữ nguyên
- C) Implement cả hai (Document cho advanced, Media cho simple)
