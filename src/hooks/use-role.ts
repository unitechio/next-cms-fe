import { useAuthorization } from '@/contexts/authorization-context';

/**
 * Hook to check if user has a specific role
 * @param role - Role name (e.g., "admin", "editor")
 * @returns boolean
 */
export function useRole(role: string): boolean {
  const { hasRole } = useAuthorization();
  return hasRole(role);
}

/**
 * Hook to check if user has any of the specified roles
 * @param roles - Array of role names
 * @returns boolean
 */
export function useAnyRole(roles: string[]): boolean {
  const { hasAnyRole } = useAuthorization();
  return hasAnyRole(roles);
}

/**
 * Hook to check if user is admin
 * @returns boolean
 */
export function useIsAdmin(): boolean {
  const { hasRole } = useAuthorization();
  return hasRole('admin') || hasRole('administrator');
}

/**
 * Hook to check if user is super admin
 * @returns boolean
 */
export function useIsSuperAdmin(): boolean {
  const { hasRole } = useAuthorization();
  return hasRole('super_admin') || hasRole('superadmin');
}

/**
 * Hook to get all user roles
 * @returns Array of role names
 */
export function useUserRoles(): string[] {
  const { roles } = useAuthorization();
  return roles;
}
