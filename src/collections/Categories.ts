import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { ar: 'تصنيف', en: 'Category' },
    plural: { ar: 'التصنيفات', en: 'Categories' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
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
