// Context
export { AuthorizationProvider, useAuthorization } from '@/contexts/authorization-context';

// Hooks
export { usePermission, useAnyPermission, useAllPermissions } from '@/hooks/use-permission';
export { useCan, useCanMultiple, useResourcePermissions } from '@/hooks/use-can';
export { useRole, useAnyRole, useIsAdmin, useIsSuperAdmin, useUserRoles } from '@/hooks/use-role';

// Components
export { PermissionGate } from '@/components/auth/permission-gate';
export { RoleGate } from '@/components/auth/role-gate';
export { CanGate } from '@/components/auth/can-gate';
export { ProtectedRoute } from '@/components/auth/protected-route';
