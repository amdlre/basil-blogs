import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { can } from '@/access/rbac'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: { ar: 'الترويسة', en: 'Header' },
  access: {
    // Public: rendered on every page of the website
    read: () => true,
    update: can('header', 'update'),
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: { ar: 'روابط القائمة', en: 'Nav items' },
      // Each language has its own menu (labels and links)
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
