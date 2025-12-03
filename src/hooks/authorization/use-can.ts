'use client';

import { useAuth } from '@/hooks/use-auth';

export function useCan() {
    const { permissions } = useAuth();

    const can = (resource: string, action: string) => {
        const permission = `${resource}:${action}`;
        return permissions?.includes(permission) ?? false;
    };

    const canAny = (checks: Array<{ resource: string; action: string }>) => {
        return checks.some(({ resource, action }) => can(resource, action));
    };

    const canAll = (checks: Array<{ resource: string; action: string }>) => {
        return checks.every(({ resource, action }) => can(resource, action));
    };

    return {
        can,
        canAny,
        canAll,
    };
}
