import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { can } from '../access/rbac'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { ar: 'تصنيف', en: 'Category' },
    plural: { ar: 'التصنيفات', en: 'Categories' },
  },
  access: {
    create: can('categories', 'create'),
    delete: can('categories', 'delete'),
    // Public: used by the website
    read: anyone,
    update: can('categories', 'update'),
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { ar: 'العنوان', en: 'Title' },
      localized: true,
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
