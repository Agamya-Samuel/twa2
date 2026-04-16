export type UserRole = 'user' | 'admin'

export const PERMISSIONS = [
  'view:modules',
  'play:modules',
  'earn:points',
  'unlock:achievements',
  'view:profile',
  'view:leaderboard',
  'create:modules',
  'edit:own:modules',
  'delete:own:modules',
  'view:own:analytics',
  'edit:any:modules',
  'delete:any:modules',
  'view:all:analytics',
  'manage:users',
  'manage:roles',
  'approve:proposals',
  'access:admin:dashboard',
] as const;

export type Permission = typeof PERMISSIONS[number];

export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    'view:modules',
    'play:modules',
    'earn:points',
    'unlock:achievements',
    'view:profile',
    'view:leaderboard',
    'create:modules',
    'edit:own:modules',
    'delete:own:modules',
    'view:own:analytics',
  ],
  admin: [
    'view:modules',
    'play:modules',
    'earn:points',
    'unlock:achievements',
    'view:profile',
    'view:leaderboard',
    'create:modules',
    'edit:own:modules',
    'delete:own:modules',
    'view:own:analytics',
    'edit:any:modules',
    'delete:any:modules',
    'view:all:analytics',
    'manage:users',
    'manage:roles',
    'approve:proposals',
    'access:admin:dashboard',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || []
}
