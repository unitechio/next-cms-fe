'use client';

import { ReactNode } from 'react';
import { useCan } from '@/hooks/use-can';

interface CanGateProps {
    children: ReactNode;
    action: string;
    resource: string;
    fallback?: ReactNode;
    showFallback?: boolean;
}

/**
 * Component to conditionally render children based on action-resource permission
 * 
 * @example
 * // Check if user can create users
 * <CanGate action="create" resource="users">
 *   <CreateUserButton />
 * </CanGate>
 * 
 * @example
 * // Check if user can delete posts
 * <CanGate action="delete" resource="posts">
 *   <DeletePostButton />
 * </CanGate>
 * 
 * @example
 * // With fallback
 * <CanGate 
 *   action="update" 
 *   resource="settings"
 *   fallback={<div>You cannot modify settings</div>}
 *   showFallback
 * >
 *   <SettingsForm />
 * </CanGate>
 */
export function CanGate({
    children,
    action,
    resource,
    fallback = null,
    showFallback = false,
}: CanGateProps) {
    const canPerformAction = useCan(action, resource);

    if (!canPerformAction) {
        return showFallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
