import type { WidgetServerProps } from 'payload'

import React from 'react'

import { Icon } from './Icon'
import { timeAgo } from './utils'
import './index.scss'

export const RecentSubmissionsWidget: React.FC<WidgetServerProps> = async ({ req }) => {
  const { payload } = req
  const adminRoute = payload.config.routes.admin

  const submissions = await payload
    .find({
      collection: 'form-submissions',
      depth: 1,
      limit: 5,
      overrideAccess: false,
      req,
      sort: '-createdAt',
    })
    .catch(() => null)

  return (
    <section className="dash-panel">
      <header className="dash-panel__header">
        <span className="dash-panel__title">
          <span className="dash-panel__icon dash-stat--pink">
            <Icon name="inbox" size={16} />
          </span>
          Latest form submissions
        </span>
        <a className="dash-panel__link" href={`${adminRoute}/collections/form-submissions`}>
          View all
          <Icon name="arrowRight" size={14} />
        </a>
      </header>

      {submissions?.docs.length ? (
        <ul className="dash-list">
          {submissions.docs.map((submission) => {
            const formTitle =
              typeof submission.form === 'object' ? submission.form?.title : 'Form submission'
            // Show the first submitted value (usually a name or email) as a preview
            const preview = submission.submissionData?.find((field) => field.value)?.value

            return (
              <li key={submission.id}>
                <a
                  className="dash-list__item"
                  href={`${adminRoute}/collections/form-submissions/${submission.id}`}
                >
                  <span className="dash-list__main">
                    <span className="dash-list__title">{preview || formTitle}</span>
                    <span className="dash-list__meta">
                      {formTitle} · {timeAgo(submission.createdAt)}
                    </span>
                  </span>
                  <Icon className="dash-list__chevron" name="arrowRight" size={16} />
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="dash-empty">
          <p>No submissions yet. They&apos;ll show up here when visitors fill in your forms.</p>
        </div>
      )}
    </section>
  )
}
