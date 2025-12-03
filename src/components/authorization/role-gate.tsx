'use client';

import { ReactNode } from 'react';
import { useRole } from '@/hooks/authorization/use-role';

interface RoleGateProps {
    role?: string;
    roles?: string[];
    requireAll?: boolean;
    children: ReactNode;
    fallback?: ReactNode;
}

export function RoleGate({
    role,
    roles,
    requireAll = false,
    children,
    fallback = null,
}: RoleGateProps) {
    const { hasRole, hasAnyRole, hasAllRoles } = useRole();

    let hasAccess = false;

    if (role) {
        hasAccess = hasRole(role);
    } else if (roles) {
        hasAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
    }

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
