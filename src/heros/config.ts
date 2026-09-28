import type { Field } from 'payload'

import { localizedUpload } from '@/fields/localizedUpload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: { ar: 'النوع', en: 'Type' },
      options: [
        {
          label: { ar: 'بدون', en: 'None' },
          value: 'none',
        },
        {
          label: { ar: 'تأثير عالٍ', en: 'High Impact' },
          value: 'highImpact',
        },
        {
          label: { ar: 'تأثير متوسط', en: 'Medium Impact' },
          value: 'mediumImpact',
        },
        {
          label: { ar: 'تأثير منخفض', en: 'Low Impact' },
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      localized: true,
    },
    linkGroup({
      overrides: {
        localized: true,
        maxRows: 2,
      },
    }),
    ...localizedUpload({
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      label: { ar: 'الصورة', en: 'Media' },
      relationTo: 'media',
      required: true,
    }),
  ],
  label: false,
}
