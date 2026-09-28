import type { WidgetServerProps } from 'payload'

import React from 'react'

import { Icon, type IconName } from './Icon'
import './index.scss'

const greeting = (hour: number) => {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const WelcomeWidget: React.FC<WidgetServerProps> = ({ req, user }) => {
  const adminRoute = req.payload.config.routes.admin
  const now = new Date()
  const name = (user && 'name' in user && typeof user.name === 'string' && user.name) || user?.email

  const actions: { href: string; icon: IconName; label: string; primary?: boolean }[] = [
    { href: `${adminRoute}/collections/posts/create`, icon: 'plus', label: 'New post', primary: true },
    { href: `${adminRoute}/collections/pages/create`, icon: 'pages', label: 'New page' },
    { href: `${adminRoute}/collections/media/create`, icon: 'upload', label: 'Upload media' },
  ]

  return (
    <section className="dash-welcome">
      <div>
        <p className="dash-welcome__date">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 className="dash-welcome__title">
          {greeting(now.getHours())}
          {name ? `, ${name}` : ''} 👋
        </h2>
        <p className="dash-welcome__subtitle">Here&apos;s what&apos;s happening with your blog.</p>
      </div>

      <div className="dash-welcome__actions">
        {actions.map((action) => (
          <a
            className={`dash-btn${action.primary ? ' dash-btn--primary' : ''}`}
            href={action.href}
            key={action.href}
          >
            <Icon name={action.icon} size={16} />
            {action.label}
          </a>
        ))}
        <a className="dash-btn" href="/" rel="noopener noreferrer" target="_blank">
          <Icon name="external" size={16} />
          View site
        </a>
      </div>
    </section>
  )
}
