import { useAuthorization } from '@/contexts/authorization-context';

/**
 * Hook to check if user has a specific permission
 * @param permission - Permission name (e.g., "users.create")
 * @returns boolean
 */
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission(permission);
}

/**
 * Hook to check if user has any of the specified permissions
 * @param permissions - Array of permission names
 * @returns boolean
 */
export function useAnyPermission(permissions: string[]): boolean {
  const { hasAnyPermission } = useAuthorization();
  return hasAnyPermission(permissions);
}

/**
 * Hook to check if user has all of the specified permissions
 * @param permissions - Array of permission names
 * @returns boolean
 */
export function useAllPermissions(permissions: string[]): boolean {
  const { hasAllPermissions } = useAuthorization();
  return hasAllPermissions(permissions);
}
