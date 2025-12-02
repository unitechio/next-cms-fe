export interface ActivityLog {
  id: string;
  user_id: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  activity: string;
  description: string;
  ip_address: string;
  user_agent: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogFilter {
  page: number;
  limit: number;
  search?: string;
  user_id?: string;
  activity?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateActivityLogRequest {
  activity: string;
  description: string;
  metadata?: Record<string, any>;
}

// Common activity types
export const ActivityTypes = {
  // User activities
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_PASSWORD_CHANGED: 'user.password_changed',
  
  // Role activities
  ROLE_CREATED: 'role.created',
  ROLE_UPDATED: 'role.updated',
  ROLE_DELETED: 'role.deleted',
  ROLE_ASSIGNED: 'role.assigned',
  ROLE_REMOVED: 'role.removed',
  
  // Permission activities
  PERMISSION_ASSIGNED: 'permission.assigned',
  PERMISSION_REMOVED: 'permission.removed',
  
  // Post activities
  POST_CREATED: 'post.created',
  POST_UPDATED: 'post.updated',
  POST_DELETED: 'post.deleted',
  POST_PUBLISHED: 'post.published',
  POST_UNPUBLISHED: 'post.unpublished',
  
  // Media activities
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_DELETED: 'media.deleted',
  
  // Settings activities
  SETTINGS_UPDATED: 'settings.updated',
  
  // System activities
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_RESTORE: 'system.restore',
} as const;

export type ActivityType = typeof ActivityTypes[keyof typeof ActivityTypes];

// Activity categories for grouping
export const ActivityCategories = {
  USER: 'User Management',
  ROLE: 'Role & Permissions',
  CONTENT: 'Content Management',
  MEDIA: 'Media Management',
  SYSTEM: 'System',
} as const;

export type ActivityCategory = typeof ActivityCategories[keyof typeof ActivityCategories];

// Helper function to get category from activity type
export function getActivityCategory(activity: string): ActivityCategory {
  if (activity.startsWith('user.')) return ActivityCategories.USER;
  if (activity.startsWith('role.') || activity.startsWith('permission.')) return ActivityCategories.ROLE;
  if (activity.startsWith('post.')) return ActivityCategories.CONTENT;
  if (activity.startsWith('media.')) return ActivityCategories.MEDIA;
  if (activity.startsWith('system.')) return ActivityCategories.SYSTEM;
  return ActivityCategories.SYSTEM;
}

// Helper function to get activity icon
export function getActivityIcon(activity: string): string {
  const category = getActivityCategory(activity);
  switch (category) {
    case ActivityCategories.USER:
      return '👤';
    case ActivityCategories.ROLE:
      return '🔐';
    case ActivityCategories.CONTENT:
      return '📝';
    case ActivityCategories.MEDIA:
      return '🖼️';
    case ActivityCategories.SYSTEM:
      return '⚙️';
    default:
      return '📋';
  }
}

// Helper function to get activity color
export function getActivityColor(activity: string): string {
  if (activity.includes('created')) return 'text-green-600';
  if (activity.includes('updated')) return 'text-blue-600';
  if (activity.includes('deleted')) return 'text-red-600';
  if (activity.includes('login')) return 'text-purple-600';
  if (activity.includes('logout')) return 'text-gray-600';
  return 'text-gray-600';
}
