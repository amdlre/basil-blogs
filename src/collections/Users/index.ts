import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'

import { can, hasRole, isSuperAdmin, superAdminFieldAccess, userCan } from '../../access/rbac'
import { adminT } from '../../i18n/admin'
import { ADMIN_ROLE_SLUG } from '../Roles'

/** Users (other than `excludeID`) whose role has full access */
const countOtherSuperAdmins = async (req: PayloadRequest, excludeID: number | string) => {
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
    where: {
      and: [{ id: { not_equals: excludeID } }, { 'role.isSuperAdmin': { equals: true } }],
    },
  })
  return totalDocs
}

const roleIsSuperAdmin = async (req: PayloadRequest, roleID: unknown) => {
  const id = roleID && typeof roleID === 'object' ? (roleID as { id: number }).id : roleID
  if (typeof id !== 'number' && typeof id !== 'string') return false

  const role = await req.payload
    .findByID({ collection: 'roles', depth: 0, id, overrideAccess: true, req })
    .catch(() => null)
  return Boolean(role?.isSuperAdmin)
}

export const Users: CollectionConfig<'users'> = {
  slug: 'users',
  labels: {
    singular: { ar: 'مستخدم', en: 'User' },
    plural: { ar: 'المستخدمون', en: 'Users' },
  },
  access: {
    // Only users with a role can open the admin panel
    admin: hasRole,
    create: can('users', 'create'),
    delete: can('users', 'delete'),
    // Everyone can see and edit their own profile; the rest needs the permission
    read: ({ req: { user } }) =>
      userCan(user, 'users', 'read') || (user ? { id: { equals: user.id } } : false),
    update: ({ req: { user } }) =>
      userCan(user, 'users', 'update') || (user ? { id: { equals: user.id } } : false),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    useAsTitle: 'name',
  },
  auth: {
    // Populate `req.user.role` so access checks can read the role's permissions
    depth: 1,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { ar: 'الاسم', en: 'Name' },
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      label: { ar: 'الدور', en: 'Role' },
      index: true,
      // Only super admins can assign roles — prevents users from promoting themselves
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
        // Hidden on the "create first user" screen, where it's assigned automatically
        condition: (_, __, { user }) => Boolean(user),
        description: {
          ar: 'يحدد ما يستطيع هذا المستخدم فعله في لوحة التحكم.',
          en: 'Controls what this user can do in the admin panel.',
        },
      },
      // Required whenever someone creates users from the admin panel
      validate: (value: unknown, { req }: { req: PayloadRequest }) =>
        value || !req.user ? true : adminT(req.i18n, 'roleRequired'),
    },
  ],
  hooks: {
    beforeValidate: [
      // The very first user (the "create first user" screen) becomes an administrator
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !data || data.role) return data

        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        })

        if (totalDocs === 0) {
          const { docs } = await req.payload.find({
            collection: 'roles',
            depth: 0,
            limit: 1,
            overrideAccess: true,
            req,
            where: { slug: { equals: ADMIN_ROLE_SLUG } },
          })
          if (docs[0]) data.role = docs[0].id
        }

        return data
      },
    ],
    beforeChange: [
      // Never leave the site without an administrator
      async ({ data, operation, originalDoc, req }) => {
        if (operation !== 'update' || !originalDoc || !('role' in data)) return data

        const wasSuperAdmin = await roleIsSuperAdmin(req, originalDoc.role)
        if (!wasSuperAdmin || (await roleIsSuperAdmin(req, data.role))) return data

        if ((await countOtherSuperAdmins(req, originalDoc.id)) === 0) {
          throw new APIError(adminT(req.i18n, 'lastSuperAdmin'), 400, undefined, true)
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const user = await req.payload
          .findByID({ collection: 'users', depth: 1, id, overrideAccess: true, req })
          .catch(() => null)

        if (isSuperAdmin(user) && (await countOtherSuperAdmins(req, id)) === 0) {
          throw new APIError(adminT(req.i18n, 'lastSuperAdmin'), 400, undefined, true)
        }
      },
    ],
  },
  timestamps: true,
}
