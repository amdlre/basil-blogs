import type { CollectionSlug, WidgetServerProps, Where } from 'payload'

import React from 'react'

import { Icon, type IconName } from './Icon'
import { formatNumber } from './utils'
import './index.scss'

type Stat = {
  accent: string
  collection: CollectionSlug
  icon: IconName
  label: string
  /** Optional second count shown under the total, e.g. drafts */
  detail?: { label: string; where: Where }
}

const stats: Stat[] = [
  {
    accent: 'violet',
    collection: 'posts',
    detail: { label: 'drafts', where: { _status: { equals: 'draft' } } },
    icon: 'posts',
    label: 'Posts',
  },
  {
    accent: 'blue',
    collection: 'pages',
    detail: { label: 'drafts', where: { _status: { equals: 'draft' } } },
    icon: 'pages',
    label: 'Pages',
  },
  { accent: 'amber', collection: 'media', icon: 'media', label: 'Media files' },
  { accent: 'green', collection: 'categories', icon: 'categories', label: 'Categories' },
  { accent: 'pink', collection: 'form-submissions', icon: 'inbox', label: 'Form submissions' },
  { accent: 'slate', collection: 'users', icon: 'users', label: 'Users' },
]

export const StatsWidget: React.FC<WidgetServerProps> = async ({ req }) => {
  const { payload } = req
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
              <span className="dash-stat__label">{stat.label}</span>
              <span className="dash-stat__value">{formatNumber(stat.total ?? 0)}</span>
              {stat.detail && stat.detailCount !== null && (
                <span className="dash-stat__detail">
                  <span className="dash-stat__dot" />
                  {formatNumber(stat.detailCount)} {stat.detail.label}
                </span>
              )}
            </span>
            <span className="dash-stat__arrow">
              <Icon name="arrowRight" size={16} />
            </span>
          </a>
        ))}
    </section>
  )
}
