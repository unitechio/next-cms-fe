'use client';

import { useAuth } from '@/hooks/use-auth';

export function useRole() {
    const { user } = useAuth();

    const hasRole = (role: string) => {
        return user?.roles?.some((r) => r.code === role || r.name === role) ?? false;
    };

    const hasAnyRole = (roles: string[]) => {
        return roles.some((role) => hasRole(role));
    };

    const hasAllRoles = (roles: string[]) => {
        return roles.every((role) => hasRole(role));
    };

    const getRoles = () => {
        return user?.roles || [];
    };

    return {
        hasRole,
        hasAnyRole,
        hasAllRoles,
        getRoles,
        roles: user?.roles || [],
    };
}
