// /**
//  * Authorization Utilities - Quick Examples
//  *
//  * This file contains quick copy-paste examples for common authorization scenarios
//  */

// // ============================================================================
// // EXAMPLE 1: Protect a page with permission
// // ============================================================================

// import { ProtectedRoute } from '@/lib/authorization';

// export default function CreateUserPage() {
//     return (
//         <ProtectedRoute permission="users.create" redirectTo="/dashboard">
//             <div>
//                 <h1>Create New User</h1>
//                 {/* Your form here */}
//             </div>
//         </ProtectedRoute>
//     );
// }

// // ============================================================================
// // EXAMPLE 2: Conditional button rendering
// // ============================================================================

// import { PermissionGate } from '@/lib/authorization';
// import { Button } from '@/components/ui/button';

// function UserActions() {
//     return (
//         <div className="flex gap-2">
//             <PermissionGate permission="users.create">
//                 <Button>Create User</Button>
//             </PermissionGate>

//             <PermissionGate permission="users.export">
//                 <Button variant="outline">Export Users</Button>
//             </PermissionGate>
//         </div>
//     );
// }

// // ============================================================================
// // EXAMPLE 3: Using hooks for complex logic
// // ============================================================================

// import { useResourcePermissions } from '@/lib/authorization';

// function UserManagement() {
//     const { canCreate, canUpdate, canDelete, canExport } = useResourcePermissions('users');

//     const handleBulkAction = () => {
//         if (!canUpdate) {
//             alert('You do not have permission to update users');
//             return;
//         }
//         // Perform bulk update
//     };

//     return (
//         <div>
//             {canCreate && <CreateButton />}
//             {(canUpdate || canDelete) && <BulkActions onAction={handleBulkAction} />}
//             {canExport && <ExportButton />}
//         </div>
//     );
// }

// // ============================================================================
// // EXAMPLE 4: Role-based sidebar menu
// // ============================================================================

// import { RoleGate, PermissionGate } from '@/lib/authorization';

// function Sidebar() {
//     return (
//         <nav>
//             {/* Always visible */}
//             <MenuItem href="/dashboard">Dashboard</MenuItem>

//             {/* Visible to users with permission */}
//             <PermissionGate anyPermission={["users.list", "users.create"]}>
//                 <MenuItem href="/users">Users</MenuItem>
//             </PermissionGate>

//             {/* Visible to admins only */}
//             <RoleGate role="admin">
//                 <MenuItem href="/admin">Admin Panel</MenuItem>
//             </RoleGate>

//             {/* Visible to admins or editors */}
//             <RoleGate anyRole={["admin", "editor"]}>
//                 <MenuItem href="/content">Content Management</MenuItem>
//             </RoleGate>
//         </nav>
//     );
// }

// // ============================================================================
// // EXAMPLE 5: Table row actions with permissions
// // ============================================================================

// import { useCan } from '@/lib/authorization';
// import { DropdownMenu } from '@/components/ui/dropdown-menu';

// function UserTableRow({ user }) {
//     const canUpdate = useCan('update', 'users');
//     const canDelete = useCan('delete', 'users');
//     const canAssignRoles = useCan('assign', 'roles');

//     if (!canUpdate && !canDelete && !canAssignRoles) {
//         return <td>-</td>;
//     }

//     return (
//         <td>
//             <DropdownMenu>
//                 {canUpdate && <DropdownMenuItem>Edit</DropdownMenuItem>}
//                 {canAssignRoles && <DropdownMenuItem>Manage Roles</DropdownMenuItem>}
//                 {canDelete && <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>}
//             </DropdownMenu>
//         </td>
//     );
// }

// // ============================================================================
// // EXAMPLE 6: Form with permission-based fields
// // ============================================================================

// import { usePermission } from '@/lib/authorization';

// function UserForm() {
//     const canSetAdmin = usePermission('users.set_admin');
//     const canAssignRoles = usePermission('roles.assign');

//     return (
//         <form>
//             <input name="name" placeholder="Name" />
//             <input name="email" placeholder="Email" />

//             {canAssignRoles && (
//                 <select name="role">
//                     <option>Select Role</option>
//                     <option>Editor</option>
//                     <option>Viewer</option>
//                 </select>
//             )}

//             {canSetAdmin && (
//                 <label>
//                     <input type="checkbox" name="is_admin" />
//                     Make Admin
//                 </label>
//             )}

//             <button type="submit">Save</button>
//         </form>
//     );
// }

// // ============================================================================
// // EXAMPLE 7: Dashboard with role-based widgets
// // ============================================================================

// import { useIsAdmin, useRole } from '@/lib/authorization';

// function Dashboard() {
//     const isAdmin = useIsAdmin();
//     const isEditor = useRole('editor');

//     return (
//         <div className="grid grid-cols-3 gap-4">
//             {/* Everyone sees this */}
//             <StatsWidget title="My Posts" />

//             {/* Only editors and admins */}
//             {(isEditor || isAdmin) && (
//                 <StatsWidget title="Pending Reviews" />
//             )}

//             {/* Only admins */}
//             {isAdmin && (
//                 <>
//                     <StatsWidget title="Total Users" />
//                     <StatsWidget title="System Health" />
//                 </>
//             )}
//         </div>
//     );
// }

// // ============================================================================
// // EXAMPLE 8: Complex permission check
// // ============================================================================

// import { useAuthorization } from '@/lib/authorization';

// function AdvancedSettings() {
//     const { hasPermission, hasRole, hasAllPermissions } = useAuthorization();

//     // Complex logic
//     const canAccessAdvanced =
//         hasRole('admin') ||
//         (hasPermission('settings.advanced') && hasPermission('settings.update'));

//     const canModifySystem =
//         hasAllPermissions(['system.update', 'system.restart']) &&
//         (hasRole('super_admin') || hasRole('system_admin'));

//     if (!canAccessAdvanced) {
//         return <div>Access Denied</div>;
//     }

//     return (
//         <div>
//             <h1>Advanced Settings</h1>

//             {canModifySystem && (
//                 <section>
//                     <h2>System Configuration</h2>
//                     {/* System settings */}
//                 </section>
//             )}
//         </div>
//     );
// }

// // ============================================================================
// // EXAMPLE 9: Refresh permissions after changes
// // ============================================================================

// import { useAuthorization } from '@/lib/authorization';
// import { userService } from '@/features/users/services/user.service';

// function AssignRoleButton({ userId, roleId }) {
//     const { refreshPermissions } = useAuthorization();

//     const handleAssignRole = async () => {
//         try {
//             await userService.assignRole(userId, roleId);

//             // Refresh permissions to reflect changes
//             await refreshPermissions();

//             alert('Role assigned successfully');
//         } catch (error) {
//             alert('Failed to assign role');
//         }
//     };

//     return <button onClick={handleAssignRole}>Assign Role</button>;
// }

// // ============================================================================
// // EXAMPLE 10: Multiple permission gates
// // ============================================================================

// import { PermissionGate, CanGate } from '@/lib/authorization';

// function ContentEditor() {
//     return (
//         <div>
//             {/* Can create OR update posts */}
//             <PermissionGate anyPermission={["posts.create", "posts.update"]}>
//                 <EditorToolbar />
//             </PermissionGate>

//             {/* Can publish posts */}
//             <CanGate action="publish" resource="posts">
//                 <PublishButton />
//             </CanGate>

//             {/* Can delete posts */}
//             <CanGate
//                 action="delete"
//                 resource="posts"
//                 fallback={<div className="text-muted-foreground">You cannot delete posts</div>}
//                 showFallback
//             >
//                 <DeleteButton />
//             </CanGate>
//         </div>
//     );
// }

// export {
//     // Export examples for reference
//     CreateUserPage,
//     UserActions,
//     UserManagement,
//     Sidebar,
//     UserTableRow,
//     UserForm,
//     Dashboard,
//     AdvancedSettings,
//     AssignRoleButton,
//     ContentEditor,
// };
