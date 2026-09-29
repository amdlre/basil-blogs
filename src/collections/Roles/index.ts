import { APIError, type CollectionConfig } from 'payload'

import { sanitizePermissions } from '../../access/permissions'
import { can, userCan } from '../../access/rbac'
import { adminT } from '../../i18n/admin'

/** The built-in super admin role; it can't be deleted or lose full access (prevents lock-out). */
export const ADMIN_ROLE_SLUG = 'admin'

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',
  labels: {
    singular: { ar: 'دور', en: 'Role' },
    plural: { ar: 'الأدوار', en: 'Roles' },
  },
  access: {
    create: can('roles', 'create'),
    delete: can('roles', 'delete'),
    // Everyone logged in can read their own role (needed to resolve permissions)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (userCan(user, 'roles', 'read')) return true

      const roleID = typeof user.role === 'object' ? user.role?.id : user.role
      return roleID ? { id: { equals: roleID } } : false
    },
    update: can('roles', 'update'),
  },
  admin: {
    defaultColumns: ['name', 'slug', 'isSuperAdmin', 'updatedAt'],
    useAsTitle: 'name',
    description: {
      ar: 'حدّد ما يستطيع كل دور فعله في لوحة التحكم، ثم أسند الدور للمستخدمين.',
      en: 'Define what each role can do in the admin panel, then assign roles to users.',
    },
  },
  defaultPopulate: {
    name: true,
    slug: true,
    isSuperAdmin: true,
    permissions: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: { ar: 'اسم الدور', en: 'Role name' },
          localized: true,
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'slug',
          type: 'text',
          label: { ar: 'المعرّف', en: 'Identifier' },
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '50%',
            description: {
              ar: 'حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثل: editor',
              en: 'Lowercase letters, numbers and dashes only, e.g. editor',
            },
          },
          validate: (value: null | string | undefined) =>
            !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
              ? true
              : 'Use lowercase letters, numbers and dashes only',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: { ar: 'الوصف', en: 'Description' },
      localized: true,
    },
    {
      name: 'isSuperAdmin',
      type: 'checkbox',
      label: { ar: 'صلاحيات كاملة (مدير النظام)', en: 'Full access (super admin)' },
      defaultValue: false,
      admin: {
        description: {
          ar: 'يمنح كل الصلاحيات على كل الأقسام، بما فيها إدارة المستخدمين والأدوار.',
          en: 'Grants every permission on every section, including managing users and roles.',
        },
      },
    },
    {
      name: 'permissions',
      type: 'json',
      label: { ar: 'الصلاحيات', en: 'Permissions' },
      defaultValue: {},
      admin: {
        condition: (_, siblingData) => !siblingData?.isSuperAdmin,
        components: {
          Field: '@/collections/Roles/PermissionsField#PermissionsField',
        },
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && 'permissions' in data) data.permissions = sanitizePermissions(data.permissions)
        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        // The built-in admin role must always keep full access
        if (originalDoc?.slug === ADMIN_ROLE_SLUG) {
          if (data.slug && data.slug !== ADMIN_ROLE_SLUG) {
            throw new APIError(adminT(req.i18n, 'adminRoleLocked'), 400, undefined, true)
          }
          data.isSuperAdmin = true
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const role = await req.payload.findByID({
          collection: 'roles',
          depth: 0,
          id,
          req,
          select: { slug: true },
        })

        if (role?.slug === ADMIN_ROLE_SLUG) {
          throw new APIError(adminT(req.i18n, 'adminRoleLocked'), 400, undefined, true)
        }

        const { totalDocs } = await req.payload.count({
          collection: 'users',
          req,
          where: { role: { equals: id } },
        })

        if (totalDocs > 0) {
          throw new APIError(
            adminT(req.i18n, 'roleInUse', { count: totalDocs }),
            400,
            undefined,
            true,
          )
        }
      },
    ],
  },
  timestamps: true,
}
