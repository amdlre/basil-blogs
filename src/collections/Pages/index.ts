import type { CollectionConfig, UploadField } from 'payload'

import { can, canReadOrPublished } from '../../access/rbac'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { localizedUpload } from '../../fields/localizedUpload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: { ar: 'صفحة', en: 'Page' },
    plural: { ar: 'الصفحات', en: 'Pages' },
  },
  access: {
    create: can('pages', 'create'),
    delete: can('pages', 'delete'),
    // The public site sees published documents; roles with read access also see drafts
    read: canReadOrPublished('pages'),
    update: can('pages', 'update'),
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
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
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: { ar: 'الواجهة', en: 'Hero' },
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: { ar: 'تخطيط الصفحة', en: 'Layout' },
              // Each language has its own set of blocks
              localized: true,
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: { ar: 'المحتوى', en: 'Content' },
        },
        {
          name: 'meta',
          label: { ar: 'تحسين محركات البحث', en: 'SEO' },
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            { ...MetaTitleField({ hasGenerateFn: true }), localized: true },
            // The SEO plugin localizes this by default; keep it shared and let the toggle opt in per language
            ...localizedUpload({
              ...(MetaImageField({ relationTo: 'media' }) as UploadField),
              localized: false,
            }),
            { ...MetaDescriptionField({}), localized: true },
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { ar: 'تاريخ النشر', en: 'Published at' },
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
