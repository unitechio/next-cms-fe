# Authorization Utilities - Usage Guide

## Overview

This authorization system provides a comprehensive set of hooks and components to manage permissions and roles in your Next.js application.

---

## Setup

### 1. Wrap your app with AuthorizationProvider

```tsx
// app/layout.tsx
import { AuthorizationProvider } from '@/lib/authorization';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthorizationProvider userId="current-user-id">
          {children}
        </AuthorizationProvider>
      </body>
    </html>
  );
}
```

---

## Hooks

### usePermission

Check if user has a specific permission.

```tsx
import { usePermission } from '@/lib/authorization';

function CreateUserButton() {
  const canCreateUsers = usePermission('users.create');
  
  if (!canCreateUsers) return null;
  
  return <button>Create User</button>;
}
```

### useAnyPermission

Check if user has any of the specified permissions.

```tsx
import { useAnyPermission } from '@/lib/authorization';

function UserActions() {
  const canManageUsers = useAnyPermission(['users.create', 'users.update', 'users.delete']);
  
  if (!canManageUsers) return null;
  
  return <div>User Management Actions</div>;
}
```

### useAllPermissions

Check if user has all of the specified permissions.

```tsx
import { useAllPermissions } from '@/lib/authorization';

function AdvancedSettings() {
  const hasAllPermissions = useAllPermissions(['settings.update', 'settings.advanced']);
  
  if (!hasAllPermissions) return null;
  
  return <div>Advanced Settings</div>;
}
```

### useCan

Check if user can perform an action on a resource.

```tsx
import { useCan } from '@/lib/authorization';

function DeleteButton({ postId }) {
  const canDelete = useCan('delete', 'posts');
  
  if (!canDelete) return null;
  
  return <button onClick={() => deletePost(postId)}>Delete</button>;
}
```

### useResourcePermissions

Get all common permissions for a resource.

```tsx
import { useResourcePermissions } from '@/lib/authorization';

function UserManagement() {
  const { canCreate, canUpdate, canDelete, canList } = useResourcePermissions('users');
  
  return (
    <div>
      {canList && <UserList />}
      {canCreate && <CreateUserButton />}
      {canUpdate && <EditUserButton />}
      {canDelete && <DeleteUserButton />}
    </div>
  );
}
```

### useRole

Check if user has a specific role.

```tsx
import { useRole } from '@/lib/authorization';

function AdminPanel() {
  const isAdmin = useRole('admin');
  
  if (!isAdmin) return null;
  
  return <div>Admin Panel</div>;
}
```

### useIsAdmin / useIsSuperAdmin

Convenient hooks for common role checks.

```tsx
import { useIsAdmin, useIsSuperAdmin } from '@/lib/authorization';

function Settings() {
  const isAdmin = useIsAdmin();
  const isSuperAdmin = useIsSuperAdmin();
  
  return (
    <div>
      {isAdmin && <AdminSettings />}
      {isSuperAdmin && <SuperAdminSettings />}
    </div>
  );
}
```

---

## Components

### PermissionGate

Conditionally render children based on permissions.

```tsx
import { PermissionGate } from '@/lib/authorization';

// Single permission
<PermissionGate permission="users.create">
  <CreateUserButton />
</PermissionGate>

// Any of multiple permissions
<PermissionGate anyPermission={["users.create", "users.update"]}>
  <UserActions />
</PermissionGate>

// All permissions required
<PermissionGate allPermissions={["users.create", "roles.assign"]}>
  <AdvancedUserActions />
</PermissionGate>

// With fallback
<PermissionGate 
  permission="users.delete" 
  fallback={<div>You don't have permission</div>}
  showFallback
>
  <DeleteButton />
</PermissionGate>
```

### RoleGate

Conditionally render children based on roles.

```tsx
import { RoleGate } from '@/lib/authorization';

// Single role
<RoleGate role="admin">
  <AdminPanel />
</RoleGate>

// Any of multiple roles
<RoleGate anyRole={["admin", "editor"]}>
  <ContentManagement />
</RoleGate>

// With fallback
<RoleGate 
  role="admin" 
  fallback={<div>Admin access required</div>}
  showFallback
>
  <AdminSettings />
</RoleGate>
```

### CanGate

Conditionally render based on action-resource permission.

```tsx
import { CanGate } from '@/lib/authorization';

// Check if user can create users
<CanGate action="create" resource="users">
  <CreateUserButton />
</CanGate>

// Check if user can delete posts
<CanGate action="delete" resource="posts">
  <DeletePostButton />
</CanGate>

// With fallback
<CanGate 
  action="update" 
  resource="settings"
  fallback={<div>You cannot modify settings</div>}
  showFallback
>
  <SettingsForm />
</CanGate>
```

### ProtectedRoute

Protect entire routes/pages.

```tsx
import { ProtectedRoute } from '@/lib/authorization';

// Protect with permission
export default function CreateUserPage() {
  return (
    <ProtectedRoute permission="users.create">
      <div>Create User Form</div>
    </ProtectedRoute>
  );
}

// Protect with role
export default function AdminPage() {
  return (
    <ProtectedRoute role="admin" redirectTo="/dashboard">
      <div>Admin Panel</div>
    </ProtectedRoute>
  );
}

// Protect with multiple permissions
export default function UserManagementPage() {
  return (
    <ProtectedRoute anyPermission={["users.create", "users.update"]}>
      <div>User Management</div>
    </ProtectedRoute>
  );
}
```

---

## Real-World Examples

### Example 1: User Management Page

```tsx
'use client';

import { useResourcePermissions } from '@/lib/authorization';
import { PermissionGate } from '@/lib/authorization';

export default function UsersPage() {
  const { canCreate, canUpdate, canDelete, canExport } = useResourcePermissions('users');
  
  return (
    <div>
      <div className="flex justify-between">
        <h1>Users</h1>
        <div className="flex gap-2">
          {canCreate && <button>Create User</button>}
          {canExport && <button>Export Users</button>}
        </div>
      </div>
      
      <UserTable 
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}
```

### Example 2: Conditional Menu Items

```tsx
import { PermissionGate, RoleGate } from '@/lib/authorization';

function Sidebar() {
  return (
    <nav>
      <MenuItem href="/dashboard">Dashboard</MenuItem>
      
      <PermissionGate anyPermission={["users.list", "users.create"]}>
        <MenuItem href="/users">Users</MenuItem>
      </PermissionGate>
      
      <PermissionGate permission="posts.list">
        <MenuItem href="/posts">Posts</MenuItem>
      </PermissionGate>
      
      <RoleGate role="admin">
        <MenuItem href="/admin">Admin Panel</MenuItem>
      </RoleGate>
    </nav>
  );
}
```

### Example 3: Action Buttons with Permissions

```tsx
import { useCan } from '@/lib/authorization';
import { CanGate } from '@/lib/authorization';

function UserRow({ user }) {
  const canUpdate = useCan('update', 'users');
  const canDelete = useCan('delete', 'users');
  
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        {canUpdate && <button>Edit</button>}
        
        <CanGate action="delete" resource="users">
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </CanGate>
      </td>
    </tr>
  );
}
```

### Example 4: Complex Permission Logic

```tsx
import { useAuthorization } from '@/lib/authorization';

function ComplexComponent() {
  const { hasPermission, hasRole, can } = useAuthorization();
  
  const canManageUsers = 
    hasRole('admin') || 
    (hasPermission('users.create') && hasPermission('users.update'));
  
  const canDeletePosts = can('delete', 'posts') && hasRole('editor');
  
  return (
    <div>
      {canManageUsers && <UserManagement />}
      {canDeletePosts && <DeletePostButton />}
    </div>
  );
}
```

---

## Permission Naming Convention

Permissions should follow the format: `resource.action`

### Common Actions:
- `create` - Create new resource
- `read` - View single resource
- `list` - View list of resources
- `update` - Modify existing resource
- `delete` - Remove resource
- `export` - Export resource data
- `import` - Import resource data

### Examples:
- `users.create`
- `users.update`
- `users.delete`
- `posts.create`
- `posts.publish`
- `settings.update`
- `roles.assign`
- `permissions.manage`

---

## Best Practices

1. **Use Components for UI** - Use `PermissionGate`, `RoleGate`, `CanGate` for conditional rendering
2. **Use Hooks for Logic** - Use hooks in component logic for complex permission checks
3. **Protect Routes** - Always use `ProtectedRoute` for sensitive pages
4. **Granular Permissions** - Define specific permissions rather than broad ones
5. **Combine Checks** - Use `useAuthorization` for complex permission logic
6. **Loading States** - Handle loading states when checking permissions
7. **Fallbacks** - Provide meaningful fallbacks for unauthorized access

---

## TypeScript Support

All hooks and components are fully typed. TypeScript will provide autocomplete and type checking.

```tsx
import { usePermission, PermissionGate } from '@/lib/authorization';

// TypeScript knows the return type
const canCreate: boolean = usePermission('users.create');

// Props are fully typed
<PermissionGate 
  permission="users.create"  // string
  fallback={<div />}         // ReactNode
  showFallback={true}        // boolean
>
  <div>Content</div>
</PermissionGate>
```

---

## Troubleshooting

### Permissions not loading
- Ensure `AuthorizationProvider` is wrapping your app
- Check that `userId` is provided to the provider
- Verify backend APIs are returning correct data

### Infinite loading
- Check for errors in browser console
- Verify API endpoints are accessible
- Ensure user ID is valid

### Permissions not updating
- Call `refreshPermissions()` after role/permission changes
- Check if cache needs to be cleared

```tsx
const { refreshPermissions } = useAuthorization();

// After assigning a role
await assignRole(userId, roleId);
await refreshPermissions();
```

---

*Generated: 2025-11-30 21:10*
