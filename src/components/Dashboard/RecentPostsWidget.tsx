import type { WidgetServerProps } from 'payload'

import React from 'react'

import { adminT } from '@/i18n/admin'

import { Icon } from './Icon'
import { timeAgo } from './utils'
import './index.scss'

export const RecentPostsWidget: React.FC<WidgetServerProps> = async ({ req }) => {
  const { i18n, payload } = req
  const adminRoute = payload.config.routes.admin

  const posts = await payload
    .find({
      collection: 'posts',
      depth: 0,
      draft: true,
      limit: 5,
      overrideAccess: false,
      req,
      select: { _status: true, title: true, updatedAt: true },
      sort: '-updatedAt',
    })
    .catch(() => null)

  return (
    <section className="dash-panel">
      <header className="dash-panel__header">
        <span className="dash-panel__title">
          <span className="dash-panel__icon dash-stat--violet">
            <Icon name="posts" size={16} />
          </span>
          {adminT(i18n, 'recentPosts')}
        </span>
        <a className="dash-panel__link" href={`${adminRoute}/collections/posts`}>
          {adminT(i18n, 'viewAll')}
          <Icon className="dash-icon-flip" name="arrowRight" size={14} />
        </a>
      </header>

      {posts?.docs.length ? (
        <ul className="dash-list">
          {posts.docs.map((post) => (
            <li key={post.id}>
              <a className="dash-list__item" href={`${adminRoute}/collections/posts/${post.id}`}>
                <span className="dash-list__main">
                  <span className="dash-list__title">{post.title || adminT(i18n, 'untitled')}</span>
                  <span className="dash-list__meta">
                    {adminT(i18n, 'updated', {
                      time: timeAgo(post.updatedAt, i18n.language, adminT(i18n, 'justNow')),
                    })}
                  </span>
                </span>
                <span className={`dash-badge dash-badge--${post._status || 'draft'}`}>
                  {adminT(i18n, post._status === 'published' ? 'published' : 'draft')}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dash-empty">
          <p>{adminT(i18n, 'noPosts')}</p>
          <a className="dash-btn dash-btn--primary" href={`${adminRoute}/collections/posts/create`}>
            <Icon name="plus" size={16} />
            {adminT(i18n, 'writeFirstPost')}
          </a>
        </div>
      )}
    </section>
  )
}
