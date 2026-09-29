import type { Access, FieldAccess, PayloadRequest } from 'payload'

import { roleCan, type Action, type ResourceSlug, type RoleLike } from './permissions'

type UserLike = { id?: number | string; role?: RoleLike | number | string | null } | null | undefined

/** Does this user's role allow `action` on `resource`? */
export const userCan = (user: UserLike, resource: ResourceSlug, action: Action): boolean =>
  Boolean(user && roleCan(user.role, resource, action))

export const isSuperAdmin = (user: UserLike): boolean =>
  Boolean(user?.role && typeof user.role === 'object' && user.role.isSuperAdmin)

/** Access function: allowed when the logged-in user's role grants `action` on `resource`. */
export const can =
  (resource: ResourceSlug, action: Action): Access =>
  ({ req: { user } }) =>
    userCan(user, resource, action)

/**
 * Read access for versioned content: users whose role can read see everything (drafts too),
 * everyone else — including the public website — only sees published documents.
 */
export const canReadOrPublished =
  (resource: ResourceSlug): Access =>
  ({ req: { user } }) =>
    userCan(user, resource, 'read') || { _status: { equals: 'published' } }

/** Only users with a role can open the admin panel. */
export const hasRole = ({ req: { user } }: { req: PayloadRequest }): boolean =>
  Boolean(user && 'role' in user && user.role)

/** Field access: only super admins may change the field (e.g. a user's role). */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)
