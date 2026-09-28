import type { CollectionSlug, WidgetServerProps, Where } from 'payload'

import React from 'react'

import { adminT, type AdminTranslationKey } from '@/i18n/admin'

import { Icon, type IconName } from './Icon'
import { formatNumber } from './utils'
import './index.scss'

type Stat = {
  accent: string
  collection: CollectionSlug
  icon: IconName
  label: AdminTranslationKey
  /** Optional second count shown under the total, e.g. drafts */
  detail?: { label: AdminTranslationKey; where: Where }
}

const stats: Stat[] = [
  {
    accent: 'violet',
    collection: 'posts',
    detail: { label: 'drafts', where: { _status: { equals: 'draft' } } },
    icon: 'posts',
    label: 'statPosts',
  },
  {
    accent: 'blue',
    collection: 'pages',
    detail: { label: 'drafts', where: { _status: { equals: 'draft' } } },
    icon: 'pages',
    label: 'statPages',
  },
  { accent: 'amber', collection: 'media', icon: 'media', label: 'statMedia' },
  { accent: 'green', collection: 'categories', icon: 'categories', label: 'statCategories' },
  { accent: 'pink', collection: 'form-submissions', icon: 'inbox', label: 'statSubmissions' },
  { accent: 'slate', collection: 'users', icon: 'users', label: 'statUsers' },
]

export const StatsWidget: React.FC<WidgetServerProps> = async ({ req }) => {
  const { i18n, payload } = req
  const adminRoute = payload.config.routes.admin

  const results = await Promise.all(
    stats.map(async (stat) => {
      const count = (where?: Where) =>
        payload
          .count({ collection: stat.collection, overrideAccess: false, req, where })
          .then((res) => res.totalDocs)
          // Hide the card if the user can't read this collection
          .catch(() => null)

      const [total, detail] = await Promise.all([
        count(),
        stat.detail ? count(stat.detail.where) : Promise.resolve(null),
      ])

      return { ...stat, detailCount: detail, total }
    }),
  )

  return (
    <section className="dash-stats">
      {results
        .filter((stat) => stat.total !== null)
        .map((stat) => (
          <a
            className={`dash-stat dash-stat--${stat.accent}`}
            href={`${adminRoute}/collections/${stat.collection}`}
            key={stat.collection}
          >
            <span className="dash-stat__icon">
              <Icon name={stat.icon} size={22} />
            </span>
            <span className="dash-stat__body">
              <span className="dash-stat__label">{adminT(i18n, stat.label)}</span>
              <span className="dash-stat__value">
                {formatNumber(stat.total ?? 0, i18n.language)}
              </span>
              {stat.detail && stat.detailCount !== null && (
                <span className="dash-stat__detail">
                  <span className="dash-stat__dot" />
                  {formatNumber(stat.detailCount, i18n.language)} {adminT(i18n, stat.detail.label)}
                </span>
              )}
            </span>
            <span className="dash-stat__arrow">
              <Icon className="dash-icon-flip" name="arrowRight" size={16} />
            </span>
          </a>
        ))}
    </section>
  )
}
