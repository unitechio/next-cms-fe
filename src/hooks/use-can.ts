import { useAuthorization } from '@/contexts/authorization-context';

/**
 * Hook to check if user can perform an action on a resource
 * @param action - Action name (e.g., "create", "update", "delete")
 * @param resource - Resource name (e.g., "users", "posts")
 * @returns boolean
 */
export function useCan(action: string, resource: string): boolean {
  const { can } = useAuthorization();
  return can(action, resource);
}

/**
 * Hook to check multiple permissions at once
 * Returns an object with permission check results
 */
export function useCanMultiple(checks: Array<{ action: string; resource: string }>) {
  const { can } = useAuthorization();
  
  return checks.reduce((acc, { action, resource }) => {
    const key = `${resource}.${action}`;
    acc[key] = can(action, resource);
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Hook to get all permissions for a resource
 * Returns an object with common CRUD permissions
 */
export function useResourcePermissions(resource: string) {
  const { can } = useAuthorization();
  
  return {
    canCreate: can('create', resource),
    canRead: can('read', resource),
    canUpdate: can('update', resource),
    canDelete: can('delete', resource),
    canList: can('list', resource),
    canExport: can('export', resource),
    canImport: can('import', resource),
  };
}
