'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { userService } from '@/features/users/services/user.service';

interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
}

interface Role {
    id: string;
    name: string;
    permissions?: Permission[];
}

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles?: Role[];
    permissions?: Permission[];
}

interface AuthorizationContextType {
    user: User | null;
    permissions: string[];
    roles: string[];
    isLoading: boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    can: (action: string, resource: string) => boolean;
    refreshPermissions: () => Promise<void>;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

interface AuthorizationProviderProps {
    children: ReactNode;
    userId?: string; // Optional: if not provided, will use current user from auth context
}

export function AuthorizationProvider({ children, userId }: AuthorizationProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadUserPermissions = async (uid: string) => {
        try {
            setIsLoading(true);

            // Load user's roles
            const rolesResponse = await userService.getUserRoles(uid);
            const userRoles = rolesResponse.data || [];

            // Load user's permissions
            const permsResponse = await userService.getUserPermissions(uid);
            const userPermissions = permsResponse.data || [];

            // Extract permission names
            const permissionNames = userPermissions.map((p: Permission) => p.name);
            const roleNames = userRoles.map((r: Role) => r.name);

            setPermissions(permissionNames);
            setRoles(roleNames);
            setUser({
                id: uid,
                email: '',
                first_name: '',
                last_name: '',
                roles: userRoles,
                permissions: userPermissions,
            });
        } catch (error) {
            console.error('Failed to load user permissions:', error);
            setPermissions([]);
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadUserPermissions(userId);
        } else {
            // TODO: Get current user ID from auth context
            setIsLoading(false);
        }
    }, [userId]);

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (perms: string[]): boolean => {
        return perms.some(p => permissions.includes(p));
    };

    const hasAllPermissions = (perms: string[]): boolean => {
        return perms.every(p => permissions.includes(p));
    };

    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    const hasAnyRole = (roleList: string[]): boolean => {
        return roleList.some(r => roles.includes(r));
    };

    const can = (action: string, resource: string): boolean => {
        const permissionName = `${resource}.${action}`;
        return permissions.includes(permissionName);
    };

    const refreshPermissions = async () => {
        if (userId) {
            await loadUserPermissions(userId);
        }
    };

    const value: AuthorizationContextType = {
        user,
        permissions,
        roles,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        can,
        refreshPermissions,
    };

    return (
        <AuthorizationContext.Provider value={value}>
            {children}
        </AuthorizationContext.Provider>
    );
}

export function useAuthorization() {
    const context = useContext(AuthorizationContext);
    if (context === undefined) {
        throw new Error('useAuthorization must be used within an AuthorizationProvider');
    }
    return context;
}
