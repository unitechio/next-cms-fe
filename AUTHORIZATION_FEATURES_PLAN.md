# Authorization & User Management Features - Implementation Plan

## Mục tiêu
Hoàn thiện các tính năng quản lý user, role, permission, scope, service, module, audit log và activity log để có thể phân quyền và tạo user mới.

## Hiện trạng

### ✅ Đã có (Cơ bản)
1. **Users Management**
   - ✅ List users page (`/dashboard/users`)
   - ✅ User service với CRUD APIs
   - ✅ User types định nghĩa
   - ⚠️ Create/Edit user forms (cần kiểm tra và bổ sung)

2. **Roles Management**
   - ✅ List roles page (`/dashboard/roles`)
   - ✅ Role service với CRUD APIs
   - ✅ Role types định nghĩa
   - ⚠️ Create/Edit role forms (cần kiểm tra và bổ sung)

3. **Authorization Entities**
   - ✅ Modules, Departments, Services, Scopes pages
   - ✅ Authorization service với đầy đủ CRUD APIs
   - ✅ Types định nghĩa đầy đủ

4. **Audit Logs**
   - ✅ List audit logs page
   - ✅ Audit log service
   - ⚠️ Detail view (cần bổ sung)

### ❌ Còn thiếu

#### 1. **User Management - Thiếu tính năng quan trọng**
- ❌ Assign roles to user (gán vai trò cho user)
- ❌ Remove roles from user
- ❌ View user's permissions (xem quyền của user)
- ❌ User activity history
- ❌ Bulk user operations (import/export)
- ❌ User status management (activate/deactivate/ban)

#### 2. **Role Management - Thiếu quản lý permissions**
- ❌ Permissions list page (`/dashboard/authorization/permissions`)
- ❌ Assign permissions to role
- ❌ Permission grouping/categorization
- ❌ Role hierarchy/inheritance
- ❌ Role usage statistics

#### 3. **Permission System**
- ❌ Permission management UI
- ❌ Permission testing/validation
- ❌ Permission templates
- ❌ Dynamic permission generation

#### 4. **Activity Log** (Hoàn toàn thiếu)
- ❌ Activity log types/models
- ❌ Activity log service
- ❌ Activity log page
- ❌ Real-time activity tracking
- ❌ Activity filtering and search

#### 5. **Advanced Features**
- ❌ Role-based access control (RBAC) middleware
- ❌ Permission checking hooks
- ❌ Scope-based filtering
- ❌ Multi-tenant support
- ❌ Audit trail for all changes

## Kế hoạch thực hiện (Ưu tiên)

### Phase 1: Hoàn thiện User & Role Management (Ưu tiên cao)

#### 1.1 Bổ sung User-Role Assignment
- [ ] Tạo component `UserRoleAssignment`
- [ ] API endpoints cho assign/remove roles
- [ ] UI để quản lý roles của user
- [ ] Validation và error handling

#### 1.2 Hoàn thiện Permission Management
- [ ] Tạo Permissions list page
- [ ] Permission detail view
- [ ] Permission grouping by resource
- [ ] Search và filter permissions

#### 1.3 Role-Permission Assignment
- [ ] Component để assign permissions to role
- [ ] Multi-select permissions UI
- [ ] Permission preview/testing
- [ ] Save và update role permissions

#### 1.4 User Forms Enhancement
- [ ] Kiểm tra và fix user create/edit forms
- [ ] Thêm role selection trong user form
- [ ] Status management
- [ ] Avatar upload
- [ ] Form validation

### Phase 2: Activity Log System (Ưu tiên cao)

#### 2.1 Activity Log Types & Models
```typescript
interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  description: string;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
}
```

#### 2.2 Activity Log Service
- [ ] Create activity log service
- [ ] CRUD operations
- [ ] Filtering và pagination
- [ ] Export functionality

#### 2.3 Activity Log UI
- [ ] Activity log list page
- [ ] Activity detail modal
- [ ] Real-time updates (WebSocket)
- [ ] Advanced filtering
- [ ] Timeline view

### Phase 3: Enhanced Audit Log (Ưu tiên trung bình)

#### 3.1 Audit Log Detail View
- [ ] Detail modal/page
- [ ] Request/Response body viewer
- [ ] Diff viewer cho changes
- [ ] Related logs linking

#### 3.2 Audit Log Filtering
- [ ] Advanced filters
- [ ] Date range picker
- [ ] User filter
- [ ] Action type filter
- [ ] Resource filter

### Phase 4: Authorization Enhancements (Ưu tiên trung bình)

#### 4.1 Permission Checking System
- [ ] `usePermission` hook
- [ ] `<PermissionGate>` component
- [ ] Route protection
- [ ] UI element hiding based on permissions

#### 4.2 Scope Management Integration
- [ ] Scope-based data filtering
- [ ] Scope selection in forms
- [ ] Scope hierarchy visualization

### Phase 5: Advanced Features (Ưu tiên thấp)

#### 5.1 Bulk Operations
- [ ] Bulk user import
- [ ] Bulk role assignment
- [ ] CSV export

#### 5.2 Analytics & Reporting
- [ ] User activity dashboard
- [ ] Permission usage statistics
- [ ] Audit log analytics

## Các file cần tạo mới

### User Management
```
src/features/users/
  ├── components/
  │   ├── user-form.tsx (cần kiểm tra/tạo)
  │   ├── user-role-assignment.tsx (mới)
  │   └── user-permissions-view.tsx (mới)
  └── hooks/
      └── use-user-roles.ts (mới)
```

### Role & Permission Management
```
src/features/roles/
  ├── components/
  │   ├── role-permission-assignment.tsx (mới)
  │   └── permission-selector.tsx (mới)

src/features/permissions/ (mới)
  ├── components/
  │   ├── permission-list.tsx
  │   └── permission-group.tsx
  ├── services/
  │   └── permission.service.ts
  ├── types/
  │   └── index.ts
  └── hooks/
      └── use-permissions.ts
```

### Activity Log
```
src/features/activity-logs/ (mới)
  ├── components/
  │   ├── activity-log-list.tsx
  │   ├── activity-log-detail.tsx
  │   └── activity-timeline.tsx
  ├── services/
  │   └── activity-log.service.ts
  ├── types/
  │   └── index.ts
  └── hooks/
      └── use-activity-logs.ts

src/app/dashboard/activity-logs/ (mới)
  └── page.tsx
```

### Shared Components
```
src/components/authorization/ (mới)
  ├── permission-gate.tsx
  └── role-badge.tsx

src/hooks/authorization/ (mới)
  ├── use-permission.ts
  └── use-can.ts
```

## API Endpoints cần có (Backend)

### User-Role Management
- `POST /api/v1/users/:id/roles` - Assign role to user
- `DELETE /api/v1/users/:id/roles/:roleId` - Remove role from user
- `GET /api/v1/users/:id/roles` - Get user's roles
- `GET /api/v1/users/:id/permissions` - Get user's effective permissions

### Permission Management
- `GET /api/v1/permissions` - List all permissions
- `GET /api/v1/permissions/:id` - Get permission detail
- `POST /api/v1/roles/:id/permissions` - Assign permissions to role
- `DELETE /api/v1/roles/:id/permissions/:permId` - Remove permission from role

### Activity Log
- `GET /api/v1/activity-logs` - List activity logs
- `GET /api/v1/activity-logs/:id` - Get activity log detail
- `POST /api/v1/activity-logs` - Create activity log (auto)

## Thứ tự thực hiện đề xuất

1. **Ngay lập tức** (Để có thể tạo user và phân quyền)
   - ✅ Kiểm tra và fix user create/edit forms
   - ✅ Tạo Permissions list page
   - ✅ Implement role-permission assignment
   - ✅ Implement user-role assignment

2. **Tiếp theo** (Để theo dõi hoạt động)
   - ✅ Tạo Activity Log system hoàn chỉnh
   - ✅ Enhance Audit Log detail view

3. **Sau đó** (Để bảo mật)
   - ✅ Implement permission checking hooks
   - ✅ Add route protection
   - ✅ Add UI permission gates

4. **Cuối cùng** (Tính năng nâng cao)
   - ✅ Bulk operations
   - ✅ Analytics
   - ✅ Advanced filtering

## Notes
- Cần đảm bảo backend APIs đã sẵn sàng trước khi implement frontend
- Cần test kỹ permission system để tránh security issues
- Activity log nên được tự động ghi nhận, không cần manual logging
- Audit log và Activity log phục vụ mục đích khác nhau:
  - **Audit Log**: System-level, API calls, security events
  - **Activity Log**: User-level, business actions, user behavior
