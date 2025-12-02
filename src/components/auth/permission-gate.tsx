'use client';

import { ReactNode } from 'react';
import { usePermission, useAnyPermission, useAllPermissions } from '@/hooks/use-permission';

interface PermissionGateProps {
    children: ReactNode;
    permission?: string;
    anyPermission?: string[];
    allPermissions?: string[];
    fallback?: ReactNode;
    showFallback?: boolean;
}

/**
 * Component to conditionally render children based on permissions
 * 
 * @example
 * // Single permission
 * <PermissionGate permission="users.create">
 *   <CreateUserButton />
 * </PermissionGate>
 * 
 * @example
 * // Any of multiple permissions
 * <PermissionGate anyPermission={["users.create", "users.update"]}>
 *   <UserActions />
 * </PermissionGate>
 * 
 * @example
 * // All permissions required
 * <PermissionGate allPermissions={["users.create", "roles.assign"]}>
 *   <AdvancedUserActions />
 * </PermissionGate>
 * 
 * @example
 * // With fallback
 * <PermissionGate 
 *   permission="users.delete" 
 *   fallback={<div>You don't have permission</div>}
 *   showFallback
 * >
 *   <DeleteButton />
 * </PermissionGate>
 */
export function PermissionGate({
    children,
    permission,
    anyPermission,
    allPermissions,
    fallback = null,
    showFallback = false,
}: PermissionGateProps) {
    const hasSinglePermission = usePermission(permission || '');
    const hasAny = useAnyPermission(anyPermission || []);
    const hasAll = useAllPermissions(allPermissions || []);

    let hasAccess = false;

    if (permission) {
        hasAccess = hasSinglePermission;
    } else if (anyPermission && anyPermission.length > 0) {
        hasAccess = hasAny;
    } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = hasAll;
    } else {
        // No permission specified, allow access
        hasAccess = true;
    }

    if (!hasAccess) {
        return showFallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
