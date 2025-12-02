'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthorization } from '@/contexts/authorization-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    permission?: string;
    anyPermission?: string[];
    allPermissions?: string[];
    role?: string;
    anyRole?: string[];
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * Component to protect routes based on permissions or roles
 * Redirects to specified path if user doesn't have access
 * 
 * @example
 * // Protect with single permission
 * <ProtectedRoute permission="users.create">
 *   <CreateUserPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect with role
 * <ProtectedRoute role="admin" redirectTo="/dashboard">
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect with multiple permissions (any)
 * <ProtectedRoute anyPermission={["users.create", "users.update"]}>
 *   <UserManagementPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
    children,
    permission,
    anyPermission,
    allPermissions,
    role,
    anyRole,
    redirectTo = '/dashboard',
    fallback,
}: ProtectedRouteProps) {
    const router = useRouter();
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        isLoading,
    } = useAuthorization();

    useEffect(() => {
        if (isLoading) return;

        let hasAccess = true;

        // Check permissions
        if (permission) {
            hasAccess = hasPermission(permission);
        } else if (anyPermission && anyPermission.length > 0) {
            hasAccess = hasAnyPermission(anyPermission);
        } else if (allPermissions && allPermissions.length > 0) {
            hasAccess = hasAllPermissions(allPermissions);
        }

        // Check roles
        if (hasAccess && role) {
            hasAccess = hasRole(role);
        } else if (hasAccess && anyRole && anyRole.length > 0) {
            hasAccess = hasAnyRole(anyRole);
        }

        if (!hasAccess) {
            router.push(redirectTo);
        }
    }, [
        isLoading,
        permission,
        anyPermission,
        allPermissions,
        role,
        anyRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        router,
        redirectTo,
    ]);

    if (isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )
        );
    }

    let hasAccess = true;

    // Check permissions
    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (anyPermission && anyPermission.length > 0) {
        hasAccess = hasAnyPermission(anyPermission);
    } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = hasAllPermissions(allPermissions);
    }

    // Check roles
    if (hasAccess && role) {
        hasAccess = hasRole(role);
    } else if (hasAccess && anyRole && anyRole.length > 0) {
        hasAccess = hasAnyRole(anyRole);
    }

    if (!hasAccess) {
        return null;
    }

    return <>{children}</>;
}
