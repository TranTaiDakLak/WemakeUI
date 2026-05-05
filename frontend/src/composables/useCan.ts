import { computed, reactive } from 'vue'

/**
 * useCan — RBAC check `resource.action`.
 *
 * 5 vai trò mặc định (theo WEMAKEUI.md §5.6): owner > admin > member > viewer > guest.
 * Permission strings dạng `team.invite`, `invoice.create`…
 *
 * Pattern singleton — gọi `setRoles([...])` 1 lần khi user login, sau đó mọi `useCan()`
 * trong app cùng đọc reactive state.
 */

export type Role = 'owner' | 'admin' | 'member' | 'viewer' | 'guest'

interface PermissionState {
  roles: Role[]
  /** override grant — qua qua role check */
  grants: Set<string>
  /** override deny — đè role check */
  denies: Set<string>
}

/** mặc định mỗi role có quyền gì. caller có thể override qua `setPermissionMap`. */
const DEFAULT_MAP: Record<Role, string[]> = {
  owner: ['*'],
  admin: [
    'team.*',
    'billing.manage',
    'invoice.*',
    'settings.*',
    'audit.read',
    'integration.*',
    'plugin.*',
    'session.*',
    'campaign.*',
  ],
  member: [
    'invoice.read',
    'invoice.create',
    'invoice.edit',
    'team.read',
    'campaign.read',
    'session.read',
  ],
  viewer: ['*.read'],
  guest: [],
}

const state = reactive<PermissionState>({
  roles: ['guest'],
  grants: new Set(),
  denies: new Set(),
})

let permissionMap: Record<Role, string[]> = { ...DEFAULT_MAP }

function matchPattern(pattern: string, perm: string): boolean {
  if (pattern === '*') return true
  if (pattern === perm) return true
  // wildcard: `team.*` match `team.invite` ; `*.read` match `invoice.read`
  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2)
    return perm.startsWith(prefix + '.')
  }
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(2)
    return perm.endsWith('.' + suffix) || perm === suffix
  }
  return false
}

function rolePermits(role: Role, perm: string): boolean {
  const list = permissionMap[role] ?? []
  return list.some((p) => matchPattern(p, perm))
}

function check(perm: string): boolean {
  if (state.denies.has(perm)) return false
  if (state.grants.has(perm)) return true
  return state.roles.some((r) => rolePermits(r, perm))
}

export function setRoles(roles: Role[]) {
  state.roles = roles.length ? roles : ['guest']
}
export function getRoles(): Role[] {
  return [...state.roles]
}
export function grant(perm: string) {
  state.grants.add(perm)
  state.denies.delete(perm)
}
export function deny(perm: string) {
  state.denies.add(perm)
  state.grants.delete(perm)
}
export function reset() {
  state.roles = ['guest']
  state.grants.clear()
  state.denies.clear()
}
export function setPermissionMap(map: Partial<Record<Role, string[]>>) {
  permissionMap = { ...DEFAULT_MAP, ...map }
}

export function useCan() {
  function can(perm: string): boolean {
    return check(perm)
  }
  function canAny(perms: string[]): boolean {
    return perms.some(check)
  }
  function canAll(perms: string[]): boolean {
    return perms.every(check)
  }
  return {
    can,
    canAny,
    canAll,
    roles: computed(() => state.roles),
    setRoles,
    grant,
    deny,
    reset,
  }
}
