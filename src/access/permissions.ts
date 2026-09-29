/**
 * Single source of truth for role-based access control.
 * Shared by the access functions (server) and the permissions matrix field (admin UI),
 * so keep this file free of server-only imports.
 */

export const collectionActions = ['read', 'create', 'update', 'delete'] as const
export const globalActions = ['read', 'update'] as const

export type Action = (typeof collectionActions)[number]

type Label = { ar: string; en: string }

type Resource = {
  label: Label
  slug: string
  type: 'collection' | 'global'
}

export const resources = [
  { slug: 'posts', type: 'collection', label: { ar: 'المقالات', en: 'Posts' } },
  { slug: 'pages', type: 'collection', label: { ar: 'الصفحات', en: 'Pages' } },
  { slug: 'media', type: 'collection', label: { ar: 'الوسائط', en: 'Media' } },
  { slug: 'categories', type: 'collection', label: { ar: 'التصنيفات', en: 'Categories' } },
  { slug: 'forms', type: 'collection', label: { ar: 'النماذج', en: 'Forms' } },
  {
    slug: 'form-submissions',
    type: 'collection',
    label: { ar: 'ردود النماذج', en: 'Form submissions' },
  },
  { slug: 'redirects', type: 'collection', label: { ar: 'التحويلات', en: 'Redirects' } },
  { slug: 'search', type: 'collection', label: { ar: 'نتائج البحث', en: 'Search results' } },
  { slug: 'users', type: 'collection', label: { ar: 'المستخدمون', en: 'Users' } },
  { slug: 'roles', type: 'collection', label: { ar: 'الأدوار', en: 'Roles' } },
  { slug: 'header', type: 'global', label: { ar: 'الترويسة', en: 'Header' } },
  { slug: 'footer', type: 'global', label: { ar: 'التذييل', en: 'Footer' } },
] as const satisfies readonly Resource[]

export type ResourceSlug = (typeof resources)[number]['slug']

/** Stored on each role as JSON: `{ posts: { read: true, create: true }, ... }` */
export type Permissions = Partial<Record<ResourceSlug, Partial<Record<Action, boolean>>>>

export const actionsFor = (resource: Resource): readonly Action[] =>
  resource.type === 'global' ? globalActions : collectionActions

/** Drop unknown resources/actions and non-boolean values before saving */
export const sanitizePermissions = (value: unknown): Permissions => {
  const input = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const clean: Permissions = {}

  for (const resource of resources) {
    const entry = input[resource.slug] as Record<string, unknown> | undefined
    if (!entry || typeof entry !== 'object') continue

    const actions: Partial<Record<Action, boolean>> = {}
    for (const action of actionsFor(resource)) {
      if (entry[action] === true) actions[action] = true
    }
    if (Object.keys(actions).length) clean[resource.slug] = actions
  }

  return clean
}

/** The minimal shape of a populated role, as seen on `req.user.role` */
export type RoleLike = {
  isSuperAdmin?: boolean | null
  permissions?: unknown
}

/** Check a role's permission for one resource/action. Super admins can do everything. */
export const roleCan = (
  role: RoleLike | number | string | null | undefined,
  resource: ResourceSlug,
  action: Action,
): boolean => {
  if (!role || typeof role !== 'object') return false
  if (role.isSuperAdmin) return true

  const permissions = role.permissions as Permissions | null | undefined
  return permissions?.[resource]?.[action] === true
}
