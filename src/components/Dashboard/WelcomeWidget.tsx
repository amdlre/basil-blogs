import type { WidgetServerProps } from 'payload'

import React from 'react'

import { adminT, type AdminTranslationKey } from '@/i18n/admin'

import { Icon, type IconName } from './Icon'
import './index.scss'

const greetingKey = (hour: number): AdminTranslationKey => {
  if (hour < 12) return 'greetingMorning'
  if (hour < 18) return 'greetingAfternoon'
  return 'greetingEvening'
}

export const WelcomeWidget: React.FC<WidgetServerProps> = ({ req, user }) => {
  const { i18n } = req
  const adminRoute = req.payload.config.routes.admin
  const now = new Date()
  const name = (user && 'name' in user && typeof user.name === 'string' && user.name) || user?.email

  const actions: { href: string; icon: IconName; label: string; primary?: boolean }[] = [
    {
      href: `${adminRoute}/collections/posts/create`,
      icon: 'plus',
      label: adminT(i18n, 'newPost'),
      primary: true,
    },
    { href: `${adminRoute}/collections/pages/create`, icon: 'pages', label: adminT(i18n, 'newPage') },
    {
      href: `${adminRoute}/collections/media/create`,
      icon: 'upload',
      label: adminT(i18n, 'uploadMedia'),
    },
  ]

  return (
    <section className="dash-welcome">
      <div>
        <p className="dash-welcome__date">
          {now.toLocaleDateString(i18n.language, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h2 className="dash-welcome__title">
          {adminT(i18n, greetingKey(now.getHours()))}
          {name ? `${i18n.language === 'ar' ? '،' : ','} ${name}` : ''} 👋
        </h2>
        <p className="dash-welcome__subtitle">{adminT(i18n, 'dashboardSubtitle')}</p>
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
        <a
          className="dash-btn"
          href={`/${i18n.language === 'en' ? 'en' : 'ar'}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="dash-icon-flip" name="external" size={16} />
          {adminT(i18n, 'viewSite')}
        </a>
      </div>
    </section>
  )
}
