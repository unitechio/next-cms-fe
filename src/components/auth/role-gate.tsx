'use client';

import { ReactNode } from 'react';
import { useRole, useAnyRole } from '@/hooks/use-role';

interface RoleGateProps {
    children: ReactNode;
    role?: string;
    anyRole?: string[];
    fallback?: ReactNode;
    showFallback?: boolean;
}

/**
 * Component to conditionally render children based on user roles
 * 
 * @example
 * // Single role
 * <RoleGate role="admin">
 *   <AdminPanel />
 * </RoleGate>
 * 
 * @example
 * // Any of multiple roles
 * <RoleGate anyRole={["admin", "editor"]}>
 *   <ContentManagement />
 * </RoleGate>
 * 
 * @example
 * // With fallback
 * <RoleGate 
 *   role="admin" 
 *   fallback={<div>Admin access required</div>}
 *   showFallback
 * >
 *   <AdminSettings />
 * </RoleGate>
 */
export function RoleGate({
    children,
    role,
    anyRole,
    fallback = null,
    showFallback = false,
}: RoleGateProps) {
    const hasSingleRole = useRole(role || '');
    const hasAny = useAnyRole(anyRole || []);

    let hasAccess = false;

    if (role) {
        hasAccess = hasSingleRole;
    } else if (anyRole && anyRole.length > 0) {
        hasAccess = hasAny;
    } else {
        // No role specified, allow access
        hasAccess = true;
    }

    if (!hasAccess) {
        return showFallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
