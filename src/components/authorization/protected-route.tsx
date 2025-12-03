'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePermission } from '@/hooks/use-permission';
import { useRole } from '@/hooks/authorization/use-role';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermission?: string;
    requiredRole?: string;
    fallback?: ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredPermission,
    requiredRole,
    fallback,
    redirectTo = '/login',
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const { hasPermission } = usePermission();
    const { hasRole } = useRole();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(redirectTo);
        }
    }, [user, isLoading, router, redirectTo]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <>{fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                        <p className="text-muted-foreground">
                            You don't have permission to access this page.
                        </p>
                    </div>
                </div>
            )}</>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <>{fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                        <p className="text-muted-foreground">
                            You don't have the required role to access this page.
                        </p>
                    </div>
                </div>
            )}</>
        );
    }

    return <>{children}</>;
}
